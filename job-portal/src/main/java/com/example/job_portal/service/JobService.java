package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.job.CreateJobRequest;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Job;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.security.UserPrincipal;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final com.example.job_portal.repository.JobQuestionRepository jobQuestionRepository;
    private final com.example.job_portal.service.ai.GeminiService geminiService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Transactional(readOnly = true)
    public PagedResponse<JobResponse> searchPublishedJobs(
            String query,
            String location,
            String workplaceType,
            String jobType,
            String experienceLevel,
            Integer minSalary,
            String sortBy,
            int page,
            int size
    ) {
        Specification<Job> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Status MUST be published and not expired, and not quarantined by AI Fraud Guard
            predicates.add(cb.equal(root.get("status"), Job.JobStatus.PUBLISHED));
            predicates.add(cb.or(cb.isNull(root.get("expiresAt")), cb.greaterThan(root.get("expiresAt"), Instant.now())));
            predicates.add(cb.or(cb.isNull(root.get("isQuarantined")), cb.isFalse(root.get("isQuarantined"))));

            // Join with Company for fetching
            Join<Job, Company> companyJoin = root.join("company", JoinType.LEFT);

            if (query != null && !query.trim().isEmpty()) {
                String pattern = "%" + query.trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), pattern);
                Predicate companyLike = cb.like(cb.lower(companyJoin.get("name")), pattern);
                predicates.add(cb.or(titleLike, descLike, companyLike));
            }

            if (location != null && !location.trim().isEmpty() && !location.equalsIgnoreCase("ALL")) {
                String locPattern = "%" + location.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("location")), locPattern));
            }

            if (workplaceType != null && !workplaceType.trim().isEmpty() && !workplaceType.equalsIgnoreCase("ALL")) {
                try {
                    Job.WorkplaceType wp = Job.WorkplaceType.valueOf(workplaceType.toUpperCase());
                    predicates.add(cb.equal(root.get("workplaceType"), wp));
                } catch (IllegalArgumentException ignored) {}
            }

            if (jobType != null && !jobType.trim().isEmpty() && !jobType.equalsIgnoreCase("ALL")) {
                try {
                    Job.JobType jt = Job.JobType.valueOf(jobType.toUpperCase());
                    predicates.add(cb.equal(root.get("jobType"), jt));
                } catch (IllegalArgumentException ignored) {}
            }

            if (experienceLevel != null && !experienceLevel.trim().isEmpty() && !experienceLevel.equalsIgnoreCase("ALL")) {
                try {
                    Job.ExperienceLevel exp = Job.ExperienceLevel.valueOf(experienceLevel.toUpperCase());
                    predicates.add(cb.equal(root.get("experienceLevel"), exp));
                } catch (IllegalArgumentException ignored) {}
            }

            if (minSalary != null && minSalary > 0) {
                Predicate minSalaryGte = cb.greaterThanOrEqualTo(root.get("minSalary"), minSalary);
                Predicate maxSalaryGte = cb.greaterThanOrEqualTo(root.get("maxSalary"), minSalary);
                predicates.add(cb.or(minSalaryGte, maxSalaryGte));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("SALARY_DESC".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "maxSalary")
                    .and(Sort.by(Sort.Direction.DESC, "minSalary"));
        } else if ("SALARY_ASC".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "minSalary")
                    .and(Sort.by(Sort.Direction.ASC, "maxSalary"));
        } else if ("POPULAR".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "applicantCount");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Job> jobPage = jobRepository.findAll(spec, pageable);

        return PagedResponse.from(jobPage.map(JobResponse::fromEntity));
    }

    @Transactional
    public JobResponse getJobBySlug(String slug) {
        Job job = jobRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "slug", slug));
        try {
            jobRepository.incrementViewsCount(job.getId());
            job.setViewsCount(job.getViewsCount() + 1);
        } catch (Exception ex) {
            log.warn("Failed to increment viewsCount for job {}: {}", job.getId(), ex.getMessage());
        }
        JobResponse response = JobResponse.fromEntity(job);
        List<com.example.job_portal.entity.JobQuestion> questions = jobQuestionRepository.findByJobIdOrderByOrderIndexAsc(job.getId());
        response.setScreeningQuestions(questions.stream().map(q -> com.example.job_portal.dto.job.JobQuestionDto.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .questionType(q.getQuestionType())
                .required(q.isRequired())
                .options(q.getOptions())
                .orderIndex(q.getOrderIndex())
                .build()).toList());
        return response;
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobResponse> getCompanyJobs(String companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobPage = jobRepository.findAllByCompanyId(companyId, pageable);
        return PagedResponse.from(jobPage.map(JobResponse::fromEntity));
    }

    @Transactional
    public JobResponse createJob(CreateJobRequest request, UserPrincipal principal) {
        if (principal.getCompanyId() == null) {
            throw new ForbiddenException("You must be affiliated with an employer company to create job requisitions");
        }

        Company company = companyRepository.findById(principal.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", principal.getCompanyId()));

        String baseSlug = toSlug(request.getTitle() + " " + company.getName());
        String slug = baseSlug;
        int counter = 1;
        while (jobRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        Job.WorkplaceType workplaceType = Job.WorkplaceType.REMOTE;
        try {
            workplaceType = Job.WorkplaceType.valueOf(request.getWorkplaceType().toUpperCase());
        } catch (Exception ignored) {}

        Job.JobType jobType = Job.JobType.FULL_TIME;
        try {
            jobType = Job.JobType.valueOf(request.getJobType().toUpperCase());
        } catch (Exception ignored) {}

        Job.JobStatus status = Job.JobStatus.PUBLISHED;
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                status = Job.JobStatus.valueOf(request.getStatus().toUpperCase());
            } catch (Exception ignored) {}
        }

        Job.ExperienceLevel experienceLevel = Job.ExperienceLevel.MID_LEVEL;
        if (request.getExperienceLevel() != null && !request.getExperienceLevel().isBlank()) {
            try {
                experienceLevel = Job.ExperienceLevel.valueOf(request.getExperienceLevel().toUpperCase());
            } catch (Exception ignored) {}
        }

        Instant expiresAt = null;
        if (request.getExpirationDays() != null && request.getExpirationDays() > 0) {
            expiresAt = Instant.now().plus(request.getExpirationDays(), ChronoUnit.DAYS);
        }

        Job job = Job.builder()
                .company(company)
                .title(request.getTitle().trim())
                .slug(slug)
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .location(request.getLocation().trim())
                .workplaceType(workplaceType)
                .jobType(jobType)
                .experienceLevel(experienceLevel)
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .salaryPeriod(request.getSalaryPeriod() != null ? request.getSalaryPeriod() : "YEARLY")
                .hasEquity(request.getHasEquity() != null ? request.getHasEquity() : false)
                .equityRange(request.getEquityRange())
                .hasSignOnBonus(request.getHasSignOnBonus() != null ? request.getHasSignOnBonus() : false)
                .signOnBonus(request.getSignOnBonus())
                .annualBonusPercentage(request.getAnnualBonusPercentage())
                .compensationNotes(request.getCompensationNotes())
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .benefits(request.getBenefits() != null ? request.getBenefits() : new ArrayList<>())
                .expiresAt(expiresAt)
                .status(status)
                .applicantCount(0)
                .build();

        // Gemini AI Anti-Fraud & Scam Analysis
        try {
            com.example.job_portal.dto.ai.JobFraudAnalysisResponse fraudAnalysis = geminiService.analyzeJobFraud(job);
            job.setFraudRiskScore(fraudAnalysis.getFraudScore());
            job.setFraudRiskLevel(fraudAnalysis.getRiskLevel());
            job.setIsQuarantined(fraudAnalysis.getIsQuarantined());
            if (fraudAnalysis.getReasons() != null) {
                job.setFraudReasons(objectMapper.writeValueAsString(fraudAnalysis.getReasons()));
            }
        } catch (Exception ex) {
            log.warn("Gemini AI job fraud analysis failed: {}", ex.getMessage());
        }

        Job savedJob = jobRepository.save(job);
        List<com.example.job_portal.dto.job.JobQuestionDto> savedQuestions = syncQuestions(savedJob, request.getScreeningQuestions());
        log.info("Created job requisition '{}' [ID: {}] for company '{}'", savedJob.getTitle(), savedJob.getId(), company.getName());
        JobResponse response = JobResponse.fromEntity(savedJob);
        response.setScreeningQuestions(savedQuestions);
        return response;
    }

    @Transactional
    public JobResponse updateJob(String jobId, CreateJobRequest request, UserPrincipal principal) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        // Strict Tenant Isolation Guard
        if (!job.getCompany().getId().equals(principal.getCompanyId())) {
            throw new ForbiddenException("Access denied: You do not have permission to manage requisitions for another company");
        }

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation().trim());

        try {
            job.setWorkplaceType(Job.WorkplaceType.valueOf(request.getWorkplaceType().toUpperCase()));
        } catch (Exception ignored) {}

        try {
            job.setJobType(Job.JobType.valueOf(request.getJobType().toUpperCase()));
        } catch (Exception ignored) {}

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                job.setStatus(Job.JobStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getExperienceLevel() != null && !request.getExperienceLevel().isBlank()) {
            try {
                job.setExperienceLevel(Job.ExperienceLevel.valueOf(request.getExperienceLevel().toUpperCase()));
            } catch (Exception ignored) {}
        }

        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        if (request.getCurrency() != null) job.setCurrency(request.getCurrency());
        if (request.getSalaryPeriod() != null) job.setSalaryPeriod(request.getSalaryPeriod());
        if (request.getHasEquity() != null) job.setHasEquity(request.getHasEquity());
        job.setEquityRange(request.getEquityRange());
        if (request.getHasSignOnBonus() != null) job.setHasSignOnBonus(request.getHasSignOnBonus());
        job.setSignOnBonus(request.getSignOnBonus());
        job.setAnnualBonusPercentage(request.getAnnualBonusPercentage());
        job.setCompensationNotes(request.getCompensationNotes());
        if (request.getTags() != null) job.setTags(request.getTags());
        if (request.getBenefits() != null) job.setBenefits(request.getBenefits());

        if (request.getExpirationDays() != null) {
            if (request.getExpirationDays() > 0) {
                job.setExpiresAt(Instant.now().plus(request.getExpirationDays(), ChronoUnit.DAYS));
            } else {
                job.setExpiresAt(null);
            }
        }

        try {
            com.example.job_portal.dto.ai.JobFraudAnalysisResponse fraudAnalysis = geminiService.analyzeJobFraud(job);
            job.setFraudRiskScore(fraudAnalysis.getFraudScore());
            job.setFraudRiskLevel(fraudAnalysis.getRiskLevel());
            job.setIsQuarantined(fraudAnalysis.getIsQuarantined());
            if (fraudAnalysis.getReasons() != null) {
                job.setFraudReasons(objectMapper.writeValueAsString(fraudAnalysis.getReasons()));
            }
        } catch (Exception ex) {
            log.warn("Gemini AI job fraud re-evaluation failed: {}", ex.getMessage());
        }

        Job updated = jobRepository.save(job);
        JobResponse resp = JobResponse.fromEntity(updated);
        if (request.getScreeningQuestions() != null) {
            jobQuestionRepository.deleteByJobId(job.getId());
            List<com.example.job_portal.dto.job.JobQuestionDto> synced = syncQuestions(updated, request.getScreeningQuestions());
            resp.setScreeningQuestions(synced);
        }
        return resp;
    }

    private List<com.example.job_portal.dto.job.JobQuestionDto> syncQuestions(Job job, List<com.example.job_portal.dto.job.JobQuestionDto> questionDtos) {
        if (questionDtos == null || questionDtos.isEmpty()) return List.of();
        List<com.example.job_portal.dto.job.JobQuestionDto> result = new ArrayList<>();
        for (int i = 0; i < questionDtos.size(); i++) {
            com.example.job_portal.dto.job.JobQuestionDto dto = questionDtos.get(i);
            if (!org.springframework.util.StringUtils.hasText(dto.getQuestionText())) continue;

            com.example.job_portal.entity.JobQuestion q = com.example.job_portal.entity.JobQuestion.builder()
                    .job(job)
                    .questionText(dto.getQuestionText().trim())
                    .questionType(dto.getQuestionType() != null ? dto.getQuestionType() : com.example.job_portal.entity.JobQuestion.QuestionType.TEXT)
                    .required(dto.isRequired())
                    .options(dto.getOptions() != null ? dto.getOptions() : List.of())
                    .orderIndex(i)
                    .build();
            com.example.job_portal.entity.JobQuestion saved = jobQuestionRepository.save(q);
            result.add(com.example.job_portal.dto.job.JobQuestionDto.builder()
                    .id(saved.getId())
                    .questionText(saved.getQuestionText())
                    .questionType(saved.getQuestionType())
                    .required(saved.isRequired())
                    .options(saved.getOptions())
                    .orderIndex(saved.getOrderIndex())
                    .build());
        }
        return result;
    }

    @Transactional
    public JobResponse updateJobStatus(String jobId, String statusStr, UserPrincipal principal) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompany().getId().equals(principal.getCompanyId())) {
            throw new ForbiddenException("Access denied: You do not have permission to manage requisitions for another company");
        }

        try {
            Job.JobStatus status = Job.JobStatus.valueOf(statusStr.toUpperCase());
            job.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid job status: " + statusStr);
        }

        Job updated = jobRepository.save(job);
        log.info("Job requisition '{}' [{}] status changed to {} by {}",
                job.getTitle(), job.getId(), job.getStatus(), principal.getEmail());
        return JobResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteJob(String jobId, UserPrincipal principal) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompany().getId().equals(principal.getCompanyId())) {
            throw new ForbiddenException("Access denied: You do not have permission to delete this requisition");
        }

        jobRepository.delete(job);
        log.info("Deleted job requisition [ID: {}] by user {}", jobId, principal.getEmail());
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobResponse> getQuarantinedJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobPage = jobRepository.findAllByIsQuarantinedTrue(pageable);
        return PagedResponse.from(jobPage.map(JobResponse::fromEntity));
    }

    @Transactional
    public JobResponse approveQuarantinedJob(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        job.setIsQuarantined(false);
        job.setFraudRiskLevel("APPROVED_BY_ADMIN");
        return JobResponse.fromEntity(jobRepository.save(job));
    }

    @Transactional
    public JobResponse rejectQuarantinedJob(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        job.setStatus(Job.JobStatus.CLOSED);
        job.setIsQuarantined(true);
        job.setFraudRiskLevel("REJECTED_BY_ADMIN");
        return JobResponse.fromEntity(jobRepository.save(job));
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-+", "-");
    }
}

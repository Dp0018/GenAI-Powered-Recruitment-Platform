package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.application.ApplicationResponse;
import com.example.job_portal.dto.application.SubmitApplicationRequest;
import com.example.job_portal.dto.application.UpdateApplicationStatusRequest;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public ApplicationResponse applyToJob(String jobId, SubmitApplicationRequest request, UserPrincipal candidateUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (job.getStatus() != Job.JobStatus.PUBLISHED) {
            throw new BadRequestException("This job requisition is not currently accepting applications");
        }

        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidateUser.getId())) {
            throw new BadRequestException("You have already submitted an application for this position");
        }

        User candidate = userRepository.findById(candidateUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateUser.getId()));

        // Prevent employer from applying to their own company's requisition
        if (candidateUser.getCompanyId() != null &&
                job.getCompany() != null &&
                candidateUser.getCompanyId().equals(job.getCompany().getId())) {
            throw new BadRequestException("You cannot apply to requisitions posted by your own organization");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .resumeUrl(request.getResumeUrl().trim())
                .coverLetter(StringUtils.hasText(request.getCoverLetter()) ? request.getCoverLetter().trim() : null)
                .phone(StringUtils.hasText(request.getPhone()) ? request.getPhone().trim() : candidate.getPhone())
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        Application saved = applicationRepository.save(application);

        // Increment applicant count on job
        job.setApplicantCount(job.getApplicantCount() + 1);
        jobRepository.save(job);

        log.info("Candidate '{}' ({}) applied to job '{}' [{}]",
                candidate.getName(), candidate.getEmail(), job.getTitle(), job.getId());

        // Send confirmation email asynchronously via Resend
        String companyName = job.getCompany() != null ? job.getCompany().getName() : "Hiring Organization";
        emailService.sendApplicationReceivedEmail(candidate.getEmail(), candidate.getName(), job.getTitle(), companyName);

        return ApplicationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public boolean hasApplied(String jobId, UserPrincipal candidateUser) {
        if (candidateUser == null) return false;
        return applicationRepository.existsByJobIdAndCandidateId(jobId, candidateUser.getId());
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponse> getCandidateApplications(UserPrincipal candidateUser, Pageable pageable) {
        Page<Application> page = applicationRepository.findByCandidateIdOrderByCreatedAtDesc(candidateUser.getId(), pageable);
        return mapToPagedResponse(page);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponse> getCompanyApplications(UserPrincipal employerUser, String jobId, Pageable pageable) {
        String companyId = employerUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not affiliated with a corporate tenant");
        }

        Page<Application> page;
        if (StringUtils.hasText(jobId)) {
            page = applicationRepository.findByJobCompanyIdAndJobIdOrderByCreatedAtDesc(companyId, jobId, pageable);
        } else {
            page = applicationRepository.findByJobCompanyIdOrderByCreatedAtDesc(companyId, pageable);
        }

        return mapToPagedResponse(page);
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(String applicationId, UpdateApplicationStatusRequest request, UserPrincipal employerUser) {
        String companyId = employerUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not affiliated with a corporate tenant");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (application.getJob() == null ||
                application.getJob().getCompany() == null ||
                !companyId.equals(application.getJob().getCompany().getId())) {
            throw new ForbiddenException("You are not authorized to update applications for another organization");
        }

        application.setStatus(request.getStatus());
        Application updated = applicationRepository.save(application);

        log.info("Application '{}' status updated to {} by employer member '{}'",
                applicationId, request.getStatus(), employerUser.getEmail());

        // Send automated status update email asynchronously via Resend
        if (application.getCandidate() != null && application.getJob() != null) {
            String companyName = application.getJob().getCompany() != null
                    ? application.getJob().getCompany().getName()
                    : "Hiring Organization";
            emailService.sendApplicationStatusUpdateEmail(
                    application.getCandidate().getEmail(),
                    application.getCandidate().getName(),
                    application.getJob().getTitle(),
                    companyName,
                    updated.getStatus(),
                    request.getNotes()
            );
        }

        return ApplicationResponse.fromEntity(updated);
    }

    private PagedResponse<ApplicationResponse> mapToPagedResponse(Page<Application> page) {
        Page<ApplicationResponse> dtoPage = page.map(ApplicationResponse::fromEntity);
        return PagedResponse.from(dtoPage);
    }
}

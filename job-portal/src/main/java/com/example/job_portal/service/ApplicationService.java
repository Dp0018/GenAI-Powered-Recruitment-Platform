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

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final com.example.job_portal.repository.ApplicationAnswerRepository applicationAnswerRepository;
    private final com.example.job_portal.repository.ApplicationScreeningNoteRepository screeningNoteRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse applyToJob(String jobId, SubmitApplicationRequest request, UserPrincipal candidateUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (job.getStatus() != Job.JobStatus.PUBLISHED) {
            throw new BadRequestException("This job requisition is not currently accepting applications");
        }

        if (job.getExpiresAt() != null && job.getExpiresAt().isBefore(java.time.Instant.now())) {
            throw new BadRequestException("This job requisition has expired and is no longer accepting applications");
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
                .referralCode(StringUtils.hasText(request.getReferralCode()) ? request.getReferralCode().trim() : null)
                .referredBy(StringUtils.hasText(request.getReferredBy()) ? request.getReferredBy().trim() : null)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        Application saved = applicationRepository.save(application);

        // Save screening answers if provided
        if (request.getScreeningAnswers() != null && !request.getScreeningAnswers().isEmpty()) {
            for (com.example.job_portal.dto.application.ScreeningAnswerDto ansDto : request.getScreeningAnswers()) {
                if (ansDto == null || !StringUtils.hasText(ansDto.getAnswerText())) continue;
                com.example.job_portal.entity.ApplicationAnswer answer = com.example.job_portal.entity.ApplicationAnswer.builder()
                        .application(saved)
                        .questionId(ansDto.getQuestionId())
                        .questionText(ansDto.getQuestionText() != null ? ansDto.getQuestionText().trim() : "Screening Question")
                        .answerText(ansDto.getAnswerText().trim())
                        .build();
                applicationAnswerRepository.save(answer);
            }
        }

        // Increment applicant count on job
        job.setApplicantCount(job.getApplicantCount() + 1);
        jobRepository.save(job);

        log.info("Candidate '{}' ({}) applied to job '{}' [{}]",
                candidate.getName(), candidate.getEmail(), job.getTitle(), job.getId());

        // Send confirmation email asynchronously via Resend
        String companyName = job.getCompany() != null ? job.getCompany().getName() : "Hiring Organization";
        emailService.sendApplicationReceivedEmail(candidate.getEmail(), candidate.getName(), job.getTitle(), companyName);

        try {
            notificationService.sendNotification(
                    candidate,
                    "Application Submitted",
                    "Your application for '" + job.getTitle() + "' at " + companyName + " was received successfully.",
                    com.example.job_portal.entity.Notification.NotificationType.APPLICATION_STATUS,
                    "/candidate/applications"
            );
        } catch (Exception ex) {
            log.warn("Failed to create in-app notification: {}", ex.getMessage());
        }

        return enrichApplicationResponse(ApplicationResponse.fromEntity(saved));
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
        if (StringUtils.hasText(request.getNotes())) {
            application.setFeedbackNote(request.getNotes().trim());
        }
        Application updated = applicationRepository.save(application);

        log.info("Application '{}' status updated to {} by employer member '{}'",
                applicationId, request.getStatus(), employerUser.getEmail());

        // Send automated status update email asynchronously via Resend
        if (application.getCandidate() != null && application.getJob() != null) {
            String cName = application.getJob().getCompany() != null
                    ? application.getJob().getCompany().getName()
                    : "Hiring Organization";
            emailService.sendApplicationStatusUpdateEmail(
                    application.getCandidate().getEmail(),
                    application.getCandidate().getName(),
                    application.getJob().getTitle(),
                    cName,
                    updated.getStatus(),
                    request.getNotes()
            );

            try {
                notificationService.sendNotification(
                        application.getCandidate(),
                        "Application Status Updated",
                        "Your application for '" + application.getJob().getTitle() + "' was updated to " + updated.getStatus().name() + ".",
                        com.example.job_portal.entity.Notification.NotificationType.APPLICATION_STATUS,
                        "/candidate/applications"
                );
            } catch (Exception ex) {
                log.warn("Failed to create in-app notification: {}", ex.getMessage());
            }
        }

        return ApplicationResponse.fromEntity(updated);
    }

    @Transactional
    public ApplicationResponse withdrawApplication(String applicationId, UserPrincipal candidateUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!application.getCandidate().getId().equals(candidateUser.getId())) {
            throw new ForbiddenException("You are not authorized to withdraw another candidate's application");
        }

        if (application.getStatus() == Application.ApplicationStatus.WITHDRAWN) {
            throw new BadRequestException("Application has already been withdrawn");
        }

        application.setStatus(Application.ApplicationStatus.WITHDRAWN);
        Application updated = applicationRepository.save(application);

        log.info("Candidate '{}' ({}) withdrew application '{}' for job '{}'",
                candidateUser.getEmail(), candidateUser.getId(), applicationId, application.getJob().getTitle());

        return enrichApplicationResponse(ApplicationResponse.fromEntity(updated));
    }

    private PagedResponse<ApplicationResponse> mapToPagedResponse(Page<Application> page) {
        Page<ApplicationResponse> dtoPage = page.map(app -> enrichApplicationResponse(ApplicationResponse.fromEntity(app)));
        return PagedResponse.from(dtoPage);
    }

    private ApplicationResponse enrichApplicationResponse(ApplicationResponse response) {
        if (response == null || response.getId() == null) return response;

        List<com.example.job_portal.entity.ApplicationAnswer> answers = applicationAnswerRepository.findByApplicationId(response.getId());
        List<com.example.job_portal.dto.application.ScreeningAnswerDto> answerDtos = answers.stream()
                .map(a -> com.example.job_portal.dto.application.ScreeningAnswerDto.builder()
                        .questionId(a.getQuestionId())
                        .questionText(a.getQuestionText())
                        .answerText(a.getAnswerText())
                        .build())
                .toList();
        response.setScreeningAnswers(answerDtos);

        Double avgRating = screeningNoteRepository.calculateAverageRatingByApplicationId(response.getId());
        response.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null);

        List<com.example.job_portal.entity.ApplicationScreeningNote> notes = screeningNoteRepository.findByApplicationIdWithAuthor(response.getId());
        response.setReviewCount(notes.size());

        return response;
    }
}

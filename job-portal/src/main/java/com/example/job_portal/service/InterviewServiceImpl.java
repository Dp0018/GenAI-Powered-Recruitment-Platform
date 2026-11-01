package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.interview.CreateInterviewRequest;
import com.example.job_portal.dto.interview.InterviewResponse;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.Application.ApplicationStatus;
import com.example.job_portal.entity.Interview;
import com.example.job_portal.entity.Interview.InterviewStatus;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.InterviewRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.job_portal.dto.interview.ProposeInterviewSlotsRequest;
import com.example.job_portal.dto.interview.SelectInterviewSlotRequest;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final IcsCalendarService icsCalendarService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public InterviewResponse scheduleInterview(CreateInterviewRequest request, UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to an employer organization");
        }

        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        if (!application.getJob().getCompany().getId().equals(companyId)) {
            throw new ForbiddenException("Application does not belong to your company's requisitions");
        }

        User employer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        User candidate = application.getCandidate();

        Interview interview = Interview.builder()
                .application(application)
                .candidate(candidate)
                .employer(employer)
                .title(request.getTitle())
                .scheduledAt(request.getScheduledAt())
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 45)
                .meetingLink(request.getMeetingLink())
                .notes(request.getNotes())
                .status(InterviewStatus.SCHEDULED)
                .build();

        Interview saved = interviewRepository.save(interview);

        // Progress application stage to INTERVIEWING if in early stages
        if (application.getStatus() == ApplicationStatus.APPLIED ||
            application.getStatus() == ApplicationStatus.REVIEWING ||
            application.getStatus() == ApplicationStatus.SHORTLISTED) {
            application.setStatus(ApplicationStatus.INTERVIEWING);
            applicationRepository.save(application);
        }

        log.info("Interview scheduled id='{}' for candidate='{}' job='{}' at {}",
                saved.getId(), candidate.getEmail(), application.getJob().getTitle(), saved.getScheduledAt());

        // Dispatch invitation email with meeting details
        emailService.sendInterviewScheduledEmail(
                candidate.getEmail(),
                candidate.getName(),
                application.getJob().getTitle(),
                application.getJob().getCompany().getName(),
                saved.getTitle(),
                saved.getScheduledAt(),
                saved.getDurationMinutes(),
                saved.getMeetingLink(),
                saved.getNotes()
        );

        try {
            notificationService.sendNotification(
                    candidate,
                    "Interview Scheduled: " + saved.getTitle(),
                    "An interview has been scheduled for " + application.getJob().getTitle() + " on " + saved.getScheduledAt(),
                    com.example.job_portal.entity.Notification.NotificationType.INTERVIEW_INVITE,
                    "/candidate/interviews"
            );
        } catch (Exception ex) {
            log.warn("Failed to create in-app notification for interview: {}", ex.getMessage());
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public InterviewResponse proposeSlots(ProposeInterviewSlotsRequest request, UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to an employer organization");
        }

        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        if (!application.getJob().getCompany().getId().equals(companyId)) {
            throw new ForbiddenException("Application does not belong to your company's requisitions");
        }

        User employer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        User candidate = application.getCandidate();

        Interview interview = Interview.builder()
                .application(application)
                .candidate(candidate)
                .employer(employer)
                .title(request.getTitle())
                .scheduledAt(null)
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 45)
                .meetingLink(request.getMeetingLink())
                .notes(request.getNotes())
                .proposedSlots(new ArrayList<>(request.getProposedSlots()))
                .status(InterviewStatus.PENDING_CANDIDATE_BOOKING)
                .build();

        Interview saved = interviewRepository.save(interview);

        if (application.getStatus() == ApplicationStatus.APPLIED ||
            application.getStatus() == ApplicationStatus.REVIEWING ||
            application.getStatus() == ApplicationStatus.SHORTLISTED) {
            application.setStatus(ApplicationStatus.INTERVIEWING);
            applicationRepository.save(application);
        }

        try {
            notificationService.sendNotification(
                    candidate,
                    "Interview Self-Scheduling: " + saved.getTitle(),
                    "The hiring team at " + application.getJob().getCompany().getName() + " has sent you interview slots. Choose your preferred time.",
                    com.example.job_portal.entity.Notification.NotificationType.INTERVIEW_INVITE,
                    "/candidate/interviews"
            );
        } catch (Exception ex) {
            log.warn("Failed to create in-app notification for proposed slots: {}", ex.getMessage());
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public InterviewResponse selectSlot(String interviewId, SelectInterviewSlotRequest request, UserPrincipal candidateUser) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        if (!interview.getCandidate().getId().equals(candidateUser.getId())) {
            throw new ForbiddenException("You are not authorized to book this interview");
        }

        if (interview.getStatus() != InterviewStatus.PENDING_CANDIDATE_BOOKING) {
            throw new BadRequestException("Interview is not pending candidate booking");
        }

        interview.setScheduledAt(request.getSelectedSlot());
        interview.setStatus(InterviewStatus.SCHEDULED);
        Interview updated = interviewRepository.save(interview);

        log.info("Candidate '{}' booked slot {} for interview id='{}'",
                candidateUser.getEmail(), request.getSelectedSlot(), interviewId);

        // Dispatch invitation email with meeting details & ICS calendar attachment
        emailService.sendInterviewScheduledEmail(
                interview.getCandidate().getEmail(),
                interview.getCandidate().getName(),
                interview.getApplication().getJob().getTitle(),
                interview.getApplication().getJob().getCompany().getName(),
                updated.getTitle(),
                updated.getScheduledAt(),
                updated.getDurationMinutes(),
                updated.getMeetingLink(),
                updated.getNotes()
        );

        try {
            notificationService.sendNotification(
                    interview.getCandidate(),
                    "Interview Confirmed: " + updated.getTitle(),
                    "Your interview for " + interview.getApplication().getJob().getTitle() + " has been booked for " + updated.getScheduledAt(),
                    com.example.job_portal.entity.Notification.NotificationType.INTERVIEW_INVITE,
                    "/candidate/interviews"
            );
        } catch (Exception ex) {
            log.warn("Failed to dispatch candidate confirmation: {}", ex.getMessage());
        }

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewResponse> getEmployerInterviews(UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to an employer organization");
        }

        List<Interview> interviews = interviewRepository.findByCompanyIdWithDetails(companyId);
        return interviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewResponse> getCandidateInterviews(UserPrincipal currentUser) {
        User candidate = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        List<Interview> interviews = interviewRepository.findByCandidateWithDetails(candidate);
        return interviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InterviewResponse cancelInterview(String interviewId, UserPrincipal currentUser) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        boolean isCandidate = interview.getCandidate().getId().equals(currentUser.getId());
        boolean isEmployer = currentUser.getCompanyId() != null &&
                currentUser.getCompanyId().equals(interview.getApplication().getJob().getCompany().getId());

        if (!isCandidate && !isEmployer) {
            throw new ForbiddenException("You are not authorized to cancel this interview");
        }

        interview.setStatus(InterviewStatus.CANCELLED);
        Interview updated = interviewRepository.save(interview);
        log.info("Interview id='{}' cancelled by user '{}'", interviewId, currentUser.getEmail());

        try {
            if (isEmployer && interview.getCandidate() != null) {
                notificationService.sendNotification(
                        interview.getCandidate(),
                        "Interview Cancelled: " + interview.getTitle(),
                        "Your interview for " + interview.getApplication().getJob().getTitle() + " has been cancelled.",
                        com.example.job_portal.entity.Notification.NotificationType.INTERVIEW_CANCELLED,
                        "/candidate/interviews"
                );
            }
        } catch (Exception ex) {
            log.warn("Failed to dispatch cancel notification: {}", ex.getMessage());
        }

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getCalendarIcs(String interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        String icsString = icsCalendarService.generateIcsCalendar(interview);
        return icsString.getBytes(StandardCharsets.UTF_8);
    }

    private InterviewResponse mapToResponse(Interview interview) {
        Application app = interview.getApplication();
        return InterviewResponse.builder()
                .id(interview.getId())
                .applicationId(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyId(app.getJob().getCompany().getId())
                .companyName(app.getJob().getCompany().getName())
                .companyLogo(app.getJob().getCompany().getLogoUrl())
                .candidateId(interview.getCandidate().getId())
                .candidateName(interview.getCandidate().getName())
                .candidateEmail(interview.getCandidate().getEmail())
                .title(interview.getTitle())
                .scheduledAt(interview.getScheduledAt())
                .durationMinutes(interview.getDurationMinutes())
                .meetingLink(interview.getMeetingLink())
                .notes(interview.getNotes())
                .proposedSlots(interview.getProposedSlots() != null ? new ArrayList<>(interview.getProposedSlots()) : List.of())
                .status(interview.getStatus())
                .createdAt(interview.getCreatedAt())
                .updatedAt(interview.getUpdatedAt())
                .build();
    }
}

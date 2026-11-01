package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.dto.application.ApplicationResponse;
import com.example.job_portal.dto.application.SubmitApplicationRequest;
import com.example.job_portal.dto.application.UpdateApplicationStatusRequest;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ApplicationService applicationService;

    private User candidateUser;
    private UserPrincipal candidatePrincipal;
    private Company company;
    private Job activeJob;
    private Job expiredJob;

    @BeforeEach
    void setUp() {
        company = Company.builder()
                .id("company-1")
                .name("Stripe Inc")
                .build();

        candidateUser = User.builder()
                .id("candidate-1")
                .name("Alex River")
                .email("alex@example.com")
                .role(Role.CANDIDATE)
                .build();

        candidatePrincipal = UserPrincipal.builder()
                .id(candidateUser.getId())
                .email(candidateUser.getEmail())
                .name(candidateUser.getName())
                .role(Role.CANDIDATE)
                .build();

        activeJob = Job.builder()
                .id("job-active")
                .title("Software Engineer")
                .company(company)
                .status(Job.JobStatus.PUBLISHED)
                .workplaceType(Job.WorkplaceType.REMOTE)
                .jobType(Job.JobType.FULL_TIME)
                .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                .applicantCount(0)
                .build();

        expiredJob = Job.builder()
                .id("job-expired")
                .title("Expired Position")
                .company(company)
                .status(Job.JobStatus.PUBLISHED)
                .workplaceType(Job.WorkplaceType.REMOTE)
                .jobType(Job.JobType.FULL_TIME)
                .expiresAt(Instant.now().minus(2, ChronoUnit.DAYS))
                .applicantCount(5)
                .build();
    }

    @Test
    @DisplayName("Should submit application successfully when job is active and not expired")
    void applyToJob_Success() {
        SubmitApplicationRequest request = SubmitApplicationRequest.builder()
                .resumeUrl("https://example.com/resume.pdf")
                .coverLetter("Excited about this opportunity")
                .phone("+1 555-0199")
                .build();

        when(jobRepository.findById("job-active")).thenReturn(Optional.of(activeJob));
        when(applicationRepository.existsByJobIdAndCandidateId("job-active", "candidate-1")).thenReturn(false);
        when(userRepository.findById("candidate-1")).thenReturn(Optional.of(candidateUser));
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> {
            Application a = inv.getArgument(0);
            a.setId("app-new");
            return a;
        });

        ApplicationResponse response = applicationService.applyToJob("job-active", request, candidatePrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(Application.ApplicationStatus.APPLIED);
        verify(jobRepository, times(1)).save(activeJob);
        assertThat(activeJob.getApplicantCount()).isEqualTo(1);
    }

    @Test
    @DisplayName("Should throw BadRequestException when applying to an expired job")
    void applyToJob_Expired_ThrowsBadRequest() {
        SubmitApplicationRequest request = SubmitApplicationRequest.builder()
                .resumeUrl("https://example.com/resume.pdf")
                .build();

        when(jobRepository.findById("job-expired")).thenReturn(Optional.of(expiredJob));

        assertThatThrownBy(() -> applicationService.applyToJob("job-expired", request, candidatePrincipal))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("expired and is no longer accepting");
    }

    @Test
    @DisplayName("Candidate should withdraw their own application successfully")
    void withdrawApplication_Success() {
        Application application = Application.builder()
                .id("app-123")
                .candidate(candidateUser)
                .job(activeJob)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        when(applicationRepository.findById("app-123")).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));

        ApplicationResponse response = applicationService.withdrawApplication("app-123", candidatePrincipal);

        assertThat(response.getStatus()).isEqualTo(Application.ApplicationStatus.WITHDRAWN);
        assertThat(application.getStatus()).isEqualTo(Application.ApplicationStatus.WITHDRAWN);
        verify(applicationRepository, times(1)).save(application);
    }

    @Test
    @DisplayName("Withdrawing an already withdrawn application throws BadRequestException")
    void withdrawApplication_AlreadyWithdrawn_ThrowsBadRequest() {
        Application application = Application.builder()
                .id("app-123")
                .candidate(candidateUser)
                .job(activeJob)
                .status(Application.ApplicationStatus.WITHDRAWN)
                .build();

        when(applicationRepository.findById("app-123")).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.withdrawApplication("app-123", candidatePrincipal))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already been withdrawn");
    }

    @Test
    @DisplayName("Candidate cannot withdraw someone else's application")
    void withdrawApplication_Unauthorized_ThrowsForbidden() {
        User otherCandidate = User.builder().id("candidate-other").email("other@example.com").build();
        Application application = Application.builder()
                .id("app-123")
                .candidate(otherCandidate)
                .job(activeJob)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        when(applicationRepository.findById("app-123")).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.withdrawApplication("app-123", candidatePrincipal))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("not authorized to withdraw");
    }

    @Test
    @DisplayName("Recruiter feedback note should be persisted when status is updated")
    void updateApplicationStatus_PersistsFeedbackNote() {
        User recruiter = User.builder()
                .id("recruiter-1")
                .email("recruiter@stripe.com")
                .role(Role.RECRUITER)
                .company(company)
                .build();

        UserPrincipal recruiterPrincipal = UserPrincipal.builder()
                .id(recruiter.getId())
                .email(recruiter.getEmail())
                .role(Role.RECRUITER)
                .companyId(company.getId())
                .build();

        Application application = Application.builder()
                .id("app-123")
                .candidate(candidateUser)
                .job(activeJob)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        UpdateApplicationStatusRequest request = UpdateApplicationStatusRequest.builder()
                .status(Application.ApplicationStatus.SHORTLISTED)
                .notes("Excellent distributed systems background, advancing to recruiter phone screen.")
                .build();

        when(applicationRepository.findById("app-123")).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));

        ApplicationResponse response = applicationService.updateApplicationStatus("app-123", request, recruiterPrincipal);

        assertThat(response.getStatus()).isEqualTo(Application.ApplicationStatus.SHORTLISTED);
        assertThat(application.getFeedbackNote()).isEqualTo("Excellent distributed systems background, advancing to recruiter phone screen.");
        verify(applicationRepository, times(1)).save(application);
    }
}

package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.dto.interview.CreateInterviewRequest;
import com.example.job_portal.dto.interview.InterviewResponse;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.Application.ApplicationStatus;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Interview;
import com.example.job_portal.entity.Interview.InterviewStatus;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.InterviewRepository;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private IcsCalendarService icsCalendarService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private InterviewServiceImpl interviewService;

    private Company company;
    private Job job;
    private User candidateUser;
    private User employerUser;
    private UserPrincipal employerPrincipal;
    private Application application;

    @BeforeEach
    void setUp() {
        company = Company.builder()
                .id("company-123")
                .name("Acme Corp")
                .slug("acme-corp")
                .build();

        employerUser = User.builder()
                .id("employer-1")
                .name("Sarah Recruiter")
                .email("sarah@acme.com")
                .role(Role.EMPLOYER_ADMIN)
                .company(company)
                .build();

        employerPrincipal = UserPrincipal.builder()
                .id("employer-1")
                .email("sarah@acme.com")
                .name("Sarah Recruiter")
                .role(Role.EMPLOYER_ADMIN)
                .companyId(company.getId())
                .build();

        candidateUser = User.builder()
                .id("candidate-1")
                .name("John Developer")
                .email("john@dev.com")
                .role(Role.CANDIDATE)
                .build();

        job = Job.builder()
                .id("job-1")
                .title("Senior Backend Engineer")
                .company(company)
                .build();

        application = Application.builder()
                .id("app-1")
                .job(job)
                .candidate(candidateUser)
                .status(ApplicationStatus.SHORTLISTED)
                .build();
    }

    @Test
    @DisplayName("Should schedule interview, advance application to INTERVIEWING, and dispatch email")
    void scheduleInterview_Success() {
        Instant scheduledTime = Instant.now().plus(2, ChronoUnit.DAYS);
        CreateInterviewRequest request = CreateInterviewRequest.builder()
                .applicationId("app-1")
                .title("Technical Architecture Interview")
                .scheduledAt(scheduledTime)
                .durationMinutes(60)
                .meetingLink("https://meet.google.com/abc-def-ghi")
                .notes("Review system design and Spring Boot concepts.")
                .build();

        when(applicationRepository.findById("app-1")).thenReturn(Optional.of(application));
        when(userRepository.findById("employer-1")).thenReturn(Optional.of(employerUser));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(invocation -> {
            Interview i = invocation.getArgument(0);
            i.setId("interview-100");
            i.setCreatedAt(Instant.now());
            return i;
        });

        InterviewResponse response = interviewService.scheduleInterview(request, employerPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("interview-100");
        assertThat(response.getTitle()).isEqualTo("Technical Architecture Interview");
        assertThat(response.getDurationMinutes()).isEqualTo(60);
        assertThat(response.getStatus()).isEqualTo(InterviewStatus.SCHEDULED);

        // Verify application status transitioned to INTERVIEWING
        assertThat(application.getStatus()).isEqualTo(ApplicationStatus.INTERVIEWING);
        verify(applicationRepository, times(1)).save(application);

        // Verify email dispatched
        verify(emailService, times(1)).sendInterviewScheduledEmail(
                eq("john@dev.com"),
                eq("John Developer"),
                eq("Senior Backend Engineer"),
                eq("Acme Corp"),
                eq("Technical Architecture Interview"),
                eq(scheduledTime),
                eq(60),
                eq("https://meet.google.com/abc-def-ghi"),
                eq("Review system design and Spring Boot concepts.")
        );
    }

    @Test
    @DisplayName("Should throw ForbiddenException if employer tries to schedule for another company's application")
    void scheduleInterview_WrongCompany_ThrowsForbidden() {
        Company otherCompany = Company.builder().id("other-company").build();
        Job otherJob = Job.builder().id("other-job").company(otherCompany).build();
        Application otherApp = Application.builder().id("app-other").job(otherJob).build();

        when(applicationRepository.findById("app-other")).thenReturn(Optional.of(otherApp));

        CreateInterviewRequest request = CreateInterviewRequest.builder()
                .applicationId("app-other")
                .title("Screening")
                .scheduledAt(Instant.now().plus(1, ChronoUnit.DAYS))
                .build();

        assertThatThrownBy(() -> interviewService.scheduleInterview(request, employerPrincipal))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("does not belong to your company");
    }

    @Test
    @DisplayName("Should cancel interview successfully")
    void cancelInterview_Success() {
        Interview interview = Interview.builder()
                .id("interview-1")
                .application(application)
                .candidate(candidateUser)
                .employer(employerUser)
                .status(InterviewStatus.SCHEDULED)
                .build();

        when(interviewRepository.findById("interview-1")).thenReturn(Optional.of(interview));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(inv -> inv.getArgument(0));

        InterviewResponse response = interviewService.cancelInterview("interview-1", employerPrincipal);

        assertThat(response.getStatus()).isEqualTo(InterviewStatus.CANCELLED);
        verify(interviewRepository, times(1)).save(interview);
    }

    @Test
    @DisplayName("Should propose multiple open slots for candidate self-booking")
    void proposeSlots_Success() {
        Instant slot1 = Instant.now().plus(2, ChronoUnit.DAYS);
        Instant slot2 = Instant.now().plus(3, ChronoUnit.DAYS);
        com.example.job_portal.dto.interview.ProposeInterviewSlotsRequest request =
                com.example.job_portal.dto.interview.ProposeInterviewSlotsRequest.builder()
                        .applicationId("app-1")
                        .title("Self-Book Technical Screening")
                        .proposedSlots(List.of(slot1, slot2))
                        .durationMinutes(45)
                        .meetingLink("https://meet.google.com/test")
                        .notes("Pick a slot that suits your schedule.")
                        .build();

        when(applicationRepository.findById("app-1")).thenReturn(Optional.of(application));
        when(userRepository.findById("employer-1")).thenReturn(Optional.of(employerUser));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(invocation -> {
            Interview i = invocation.getArgument(0);
            i.setId("interview-self-1");
            i.setCreatedAt(Instant.now());
            return i;
        });

        InterviewResponse response = interviewService.proposeSlots(request, employerPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("interview-self-1");
        assertThat(response.getStatus()).isEqualTo(InterviewStatus.PENDING_CANDIDATE_BOOKING);
        assertThat(response.getProposedSlots()).hasSize(2);
        assertThat(application.getStatus()).isEqualTo(ApplicationStatus.INTERVIEWING);
        verify(notificationService, times(1)).sendNotification(
                eq(candidateUser),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    @DisplayName("Should confirm candidate slot selection, transition to SCHEDULED, and dispatch calendar invite")
    void selectSlot_Success() {
        Instant slot1 = Instant.now().plus(2, ChronoUnit.DAYS);
        Instant slot2 = Instant.now().plus(3, ChronoUnit.DAYS);
        Interview interview = Interview.builder()
                .id("interview-self-1")
                .application(application)
                .candidate(candidateUser)
                .employer(employerUser)
                .status(InterviewStatus.PENDING_CANDIDATE_BOOKING)
                .proposedSlots(List.of(slot1, slot2))
                .durationMinutes(45)
                .title("Self-Book Technical Screening")
                .meetingLink("https://meet.google.com/test")
                .notes("Pick a slot")
                .build();

        when(interviewRepository.findById("interview-self-1")).thenReturn(Optional.of(interview));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(inv -> inv.getArgument(0));

        com.example.job_portal.dto.interview.SelectInterviewSlotRequest request =
                com.example.job_portal.dto.interview.SelectInterviewSlotRequest.builder()
                        .selectedSlot(slot2)
                        .build();

        UserPrincipal candidatePrincipal = UserPrincipal.builder()
                .id("candidate-1")
                .email("john@dev.com")
                .name("John Developer")
                .role(Role.CANDIDATE)
                .build();

        InterviewResponse response = interviewService.selectSlot("interview-self-1", request, candidatePrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(InterviewStatus.SCHEDULED);
        assertThat(response.getScheduledAt()).isEqualTo(slot2);

        verify(emailService, times(1)).sendInterviewScheduledEmail(
                eq("john@dev.com"),
                eq("John Developer"),
                eq("Senior Backend Engineer"),
                eq("Acme Corp"),
                eq("Self-Book Technical Screening"),
                eq(slot2),
                eq(45),
                eq("https://meet.google.com/test"),
                eq("Pick a slot")
        );
    }

    @Test
    @DisplayName("Should generate ICS calendar file bytes")
    void getCalendarIcs_Success() {
        Interview interview = Interview.builder()
                .id("interview-1")
                .application(application)
                .candidate(candidateUser)
                .employer(employerUser)
                .build();

        when(interviewRepository.findById("interview-1")).thenReturn(Optional.of(interview));
        when(icsCalendarService.generateIcsCalendar(interview)).thenReturn("BEGIN:VCALENDAR\nEND:VCALENDAR");

        byte[] icsBytes = interviewService.getCalendarIcs("interview-1");

        assertThat(icsBytes).isNotEmpty();
        assertThat(new String(icsBytes)).contains("BEGIN:VCALENDAR");
    }
}

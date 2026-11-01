package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.dto.alert.CreateJobAlertRequest;
import com.example.job_portal.dto.alert.JobAlertResponse;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.JobAlert;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.JobAlertRepository;
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
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobAlertServiceTest {

    @Mock
    private JobAlertRepository jobAlertRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private JobAlertServiceImpl jobAlertService;

    private User candidateUser;
    private UserPrincipal candidatePrincipal;

    @BeforeEach
    void setUp() {
        candidateUser = User.builder()
                .id("cand-1")
                .name("Sarah Connor")
                .email("sarah@dev.com")
                .role(Role.CANDIDATE)
                .build();

        candidatePrincipal = UserPrincipal.builder()
                .id("cand-1")
                .name("Sarah Connor")
                .email("sarah@dev.com")
                .role(Role.CANDIDATE)
                .build();
    }

    @Test
    @DisplayName("Should successfully create a new job alert")
    void createAlert_Success() {
        CreateJobAlertRequest request = CreateJobAlertRequest.builder()
                .keyword("Rust")
                .location("Remote")
                .frequency(JobAlert.AlertFrequency.DAILY)
                .build();

        when(userRepository.findById("cand-1")).thenReturn(Optional.of(candidateUser));
        when(jobAlertRepository.save(any(JobAlert.class))).thenAnswer(inv -> {
            JobAlert a = inv.getArgument(0);
            a.setId("alert-1");
            return a;
        });

        JobAlertResponse response = jobAlertService.createAlert(candidatePrincipal, request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("alert-1");
        assertThat(response.getKeyword()).isEqualTo("Rust");
        assertThat(response.getLocation()).isEqualTo("Remote");
        assertThat(response.isActive()).isTrue();
        verify(jobAlertRepository).save(any(JobAlert.class));
    }

    @Test
    @DisplayName("Should toggle alert active status")
    void toggleAlert_Success() {
        JobAlert alert = JobAlert.builder()
                .id("alert-1")
                .candidate(candidateUser)
                .keyword("React")
                .active(true)
                .build();

        when(jobAlertRepository.findById("alert-1")).thenReturn(Optional.of(alert));
        when(jobAlertRepository.save(any(JobAlert.class))).thenAnswer(inv -> inv.getArgument(0));

        JobAlertResponse response = jobAlertService.toggleAlert(candidatePrincipal, "alert-1");

        assertThat(response.isActive()).isFalse();
    }

    @Test
    @DisplayName("Should prevent modifying job alert belonging to another user")
    void deleteAlert_Forbidden() {
        User otherUser = User.builder().id("other-user").build();
        JobAlert otherAlert = JobAlert.builder().id("alert-other").candidate(otherUser).build();

        when(jobAlertRepository.findById("alert-other")).thenReturn(Optional.of(otherAlert));

        assertThatThrownBy(() -> jobAlertService.deleteAlert(candidatePrincipal, "alert-other"))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    @DisplayName("Should process active alerts and send email digests for matching jobs")
    void triggerDigestExecution_Success() {
        JobAlert alert = JobAlert.builder()
                .id("alert-1")
                .candidate(candidateUser)
                .keyword("Java")
                .active(true)
                .build();

        Job job = Job.builder().id("job-1").title("Senior Java Developer").build();

        when(jobAlertRepository.findByActiveTrue()).thenReturn(List.of(alert));
        when(jobRepository.findAll(any(Specification.class))).thenReturn(List.of(job));

        int dispatched = jobAlertService.triggerDigestExecution();

        assertThat(dispatched).isEqualTo(1);
        verify(emailService).sendJobAlertDigestEmail(eq("sarah@dev.com"), eq("Sarah Connor"), eq("Java"), eq(List.of(job)));
        verify(jobAlertRepository).save(alert);
    }
}

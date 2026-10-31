package com.example.job_portal.service;

import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.SavedJob;
import com.example.job_portal.entity.User;
import com.example.job_portal.entity.Role;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.SavedJobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SavedJobServiceTest {

    @Mock
    private SavedJobRepository savedJobRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SavedJobServiceImpl savedJobService;

    private UserPrincipal testUserPrincipal;
    private User testUser;
    private Job testJob;
    private Company testCompany;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id("user-123")
                .email("candidate@example.com")
                .name("Test Candidate")
                .role(Role.CANDIDATE)
                .build();

        testUserPrincipal = UserPrincipal.create(testUser, "password");

        testCompany = Company.builder()
                .id("company-123")
                .name("Tech Corp")
                .slug("tech-corp")
                .build();

        testJob = Job.builder()
                .id("job-456")
                .title("Full Stack Engineer")
                .slug("full-stack-engineer-job-456")
                .company(testCompany)
                .location("Remote")
                .workplaceType(Job.WorkplaceType.REMOTE)
                .build();
    }

    @Test
    @DisplayName("toggleSaveJob saves job when not already saved and returns true")
    void toggleSaveJob_whenNotSaved_shouldSaveAndReturnTrue() {
        when(savedJobRepository.findByUserIdAndJobId("user-123", "job-456"))
                .thenReturn(Optional.empty());
        when(jobRepository.findById("job-456")).thenReturn(Optional.of(testJob));
        when(userRepository.findById("user-123")).thenReturn(Optional.of(testUser));

        boolean result = savedJobService.toggleSaveJob("job-456", testUserPrincipal);

        assertThat(result).isTrue();
        verify(savedJobRepository).save(any(SavedJob.class));
        verify(savedJobRepository, never()).delete(any());
    }

    @Test
    @DisplayName("toggleSaveJob removes bookmark when already saved and returns false")
    void toggleSaveJob_whenAlreadySaved_shouldDeleteAndReturnFalse() {
        SavedJob existing = SavedJob.builder()
                .id("saved-1")
                .user(testUser)
                .job(testJob)
                .build();

        when(savedJobRepository.findByUserIdAndJobId("user-123", "job-456"))
                .thenReturn(Optional.of(existing));

        boolean result = savedJobService.toggleSaveJob("job-456", testUserPrincipal);

        assertThat(result).isFalse();
        verify(savedJobRepository).delete(existing);
        verify(savedJobRepository, never()).save(any());
    }

    @Test
    @DisplayName("toggleSaveJob throws ResourceNotFoundException when job does not exist")
    void toggleSaveJob_whenJobNotFound_shouldThrow() {
        when(savedJobRepository.findByUserIdAndJobId("user-123", "invalid-job"))
                .thenReturn(Optional.empty());
        when(jobRepository.findById("invalid-job")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> savedJobService.toggleSaveJob("invalid-job", testUserPrincipal))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Job");
    }

    @Test
    @DisplayName("isJobSaved returns true when repository confirms existence")
    void isJobSaved_whenExists_shouldReturnTrue() {
        when(savedJobRepository.existsByUserIdAndJobId("user-123", "job-456")).thenReturn(true);

        boolean isSaved = savedJobService.isJobSaved("job-456", testUserPrincipal);

        assertThat(isSaved).isTrue();
    }

    @Test
    @DisplayName("isJobSaved returns false when user principal is null")
    void isJobSaved_whenUserNull_shouldReturnFalse() {
        boolean isSaved = savedJobService.isJobSaved("job-456", null);

        assertThat(isSaved).isFalse();
        verifyNoInteractions(savedJobRepository);
    }

    @Test
    @DisplayName("getSavedJobs returns paginated JobResponse list")
    void getSavedJobs_shouldReturnPagedResponse() {
        SavedJob savedJob = SavedJob.builder()
                .id("saved-1")
                .user(testUser)
                .job(testJob)
                .build();
        Pageable pageable = PageRequest.of(0, 10);
        Page<SavedJob> page = new PageImpl<>(List.of(savedJob), pageable, 1);

        when(savedJobRepository.findByUserIdOrderByCreatedAtDesc("user-123", pageable))
                .thenReturn(page);

        PagedResponse<JobResponse> response = savedJobService.getSavedJobs(testUserPrincipal, pageable);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getTitle()).isEqualTo("Full Stack Engineer");
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("removeSavedJob calls repository delete")
    void removeSavedJob_shouldDelegateToRepository() {
        savedJobService.removeSavedJob("job-456", testUserPrincipal);

        verify(savedJobRepository).deleteByUserIdAndJobId("user-123", "job-456");
    }
}

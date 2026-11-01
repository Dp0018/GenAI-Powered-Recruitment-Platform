package com.example.job_portal.service;

import com.example.job_portal.dto.profile.CandidateResumeResponse;
import com.example.job_portal.dto.profile.CreateCandidateResumeRequest;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.CandidateResume;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.CandidateProfileRepository;
import com.example.job_portal.repository.CandidateResumeRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidateResumeServiceTest {

    @Mock
    private CandidateResumeRepository candidateResumeRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CandidateResumeServiceImpl candidateResumeService;

    private User candidate;
    private UserPrincipal candidatePrincipal;
    private CandidateProfile profile;

    @BeforeEach
    void setUp() {
        candidate = User.builder()
                .id("cand-1")
                .email("alex@example.com")
                .name("Alex Johnson")
                .role(Role.CANDIDATE)
                .build();

        candidatePrincipal = UserPrincipal.create(candidate, "password");

        profile = CandidateProfile.builder()
                .id("prof-1")
                .user(candidate)
                .headline("Staff Software Engineer")
                .resumeUrl("https://ik.imagekit.io/jobportal/resumes/old.pdf")
                .resumeFileName("old.pdf")
                .build();
    }

    @Test
    @DisplayName("Get my resumes returns candidate's saved resumes")
    void getMyResumes_Success() {
        CandidateResume resume1 = CandidateResume.builder()
                .id("res-1")
                .candidate(candidate)
                .title("Fullstack Resume")
                .fileName("alex_fullstack.pdf")
                .fileUrl("https://cdn.example.com/alex_fullstack.pdf")
                .isDefault(true)
                .build();

        when(candidateResumeRepository.findByCandidateIdOrderByCreatedAtDesc("cand-1"))
                .thenReturn(List.of(resume1));

        List<CandidateResumeResponse> result = candidateResumeService.getMyResumes(candidatePrincipal);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Fullstack Resume");
        assertThat(result.get(0).isDefault()).isTrue();
    }

    @Test
    @DisplayName("First uploaded resume is automatically marked as default and synced to profile")
    void addResume_FirstResume_AutoDefault() {
        CreateCandidateResumeRequest request = CreateCandidateResumeRequest.builder()
                .title("Backend Systems Specialist")
                .fileName("alex_backend.pdf")
                .fileUrl("https://cdn.example.com/alex_backend.pdf")
                .fileType("application/pdf")
                .fileSize(102400L)
                .build();

        when(userRepository.findById("cand-1")).thenReturn(Optional.of(candidate));
        when(candidateResumeRepository.countByCandidateId("cand-1")).thenReturn(0L);
        when(candidateProfileRepository.findByUserId("cand-1")).thenReturn(Optional.of(profile));
        when(candidateResumeRepository.save(any(CandidateResume.class))).thenAnswer(i -> {
            CandidateResume r = i.getArgument(0);
            r.setId("res-new");
            return r;
        });

        CandidateResumeResponse response = candidateResumeService.addResume(request, candidatePrincipal);

        assertThat(response.isDefault()).isTrue();
        assertThat(response.getTitle()).isEqualTo("Backend Systems Specialist");
        assertThat(profile.getResumeUrl()).isEqualTo("https://cdn.example.com/alex_backend.pdf");
        assertThat(profile.getResumeFileName()).isEqualTo("alex_backend.pdf");
        verify(candidateProfileRepository).save(profile);
    }

    @Test
    @DisplayName("Set default resume promotes target and unsets previous default")
    void setDefaultResume_Success() {
        CandidateResume oldDefault = CandidateResume.builder()
                .id("res-1")
                .candidate(candidate)
                .title("General Resume")
                .isDefault(true)
                .build();

        CandidateResume newDefault = CandidateResume.builder()
                .id("res-2")
                .candidate(candidate)
                .title("Cloud Architect CV")
                .fileName("alex_cloud.pdf")
                .fileUrl("https://cdn.example.com/alex_cloud.pdf")
                .isDefault(false)
                .build();

        when(candidateResumeRepository.findByIdAndCandidateId("res-2", "cand-1"))
                .thenReturn(Optional.of(newDefault));
        when(candidateResumeRepository.findByCandidateIdOrderByCreatedAtDesc("cand-1"))
                .thenReturn(List.of(oldDefault, newDefault));
        when(candidateResumeRepository.save(any(CandidateResume.class))).thenAnswer(i -> i.getArgument(0));
        when(candidateProfileRepository.findByUserId("cand-1")).thenReturn(Optional.of(profile));

        CandidateResumeResponse response = candidateResumeService.setDefaultResume("res-2", candidatePrincipal);

        assertThat(response.isDefault()).isTrue();
        assertThat(oldDefault.isDefault()).isFalse();
        assertThat(profile.getResumeUrl()).isEqualTo("https://cdn.example.com/alex_cloud.pdf");
        verify(candidateProfileRepository).save(profile);
    }

    @Test
    @DisplayName("Deleting default resume promotes next available resume")
    void deleteResume_WhenDefault_PromotesNext() {
        CandidateResume toDelete = CandidateResume.builder()
                .id("res-1")
                .candidate(candidate)
                .title("Outdated Resume")
                .isDefault(true)
                .build();

        CandidateResume remaining = CandidateResume.builder()
                .id("res-2")
                .candidate(candidate)
                .title("Updated Resume")
                .fileName("alex_updated.pdf")
                .fileUrl("https://cdn.example.com/alex_updated.pdf")
                .isDefault(false)
                .build();

        when(candidateResumeRepository.findByIdAndCandidateId("res-1", "cand-1"))
                .thenReturn(Optional.of(toDelete));
        when(candidateResumeRepository.findByCandidateIdOrderByCreatedAtDesc("cand-1"))
                .thenReturn(List.of(remaining));
        when(candidateProfileRepository.findByUserId("cand-1")).thenReturn(Optional.of(profile));

        candidateResumeService.deleteResume("res-1", candidatePrincipal);

        verify(candidateResumeRepository).delete(toDelete);
        assertThat(remaining.isDefault()).isTrue();
        assertThat(profile.getResumeUrl()).isEqualTo("https://cdn.example.com/alex_updated.pdf");
        verify(candidateProfileRepository).save(profile);
    }
}

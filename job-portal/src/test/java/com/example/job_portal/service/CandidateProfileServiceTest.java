package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.dto.profile.CandidateProfileResponse;
import com.example.job_portal.dto.profile.EducationHistoryDto;
import com.example.job_portal.dto.profile.WorkExperienceDto;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.EducationHistory;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.entity.WorkExperience;
import com.example.job_portal.repository.CandidateProfileRepository;
import com.example.job_portal.repository.EducationHistoryRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.repository.WorkExperienceRepository;
import com.example.job_portal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidateProfileServiceTest {

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkExperienceRepository workExperienceRepository;

    @Mock
    private EducationHistoryRepository educationHistoryRepository;

    @InjectMocks
    private CandidateProfileServiceImpl candidateProfileService;

    private User candidateUser;
    private UserPrincipal candidatePrincipal;
    private CandidateProfile candidateProfile;

    @BeforeEach
    void setUp() {
        candidateUser = User.builder()
                .id("cand-1")
                .name("Alex Johnson")
                .email("alex@example.com")
                .role(Role.CANDIDATE)
                .build();

        candidatePrincipal = UserPrincipal.builder()
                .id("cand-1")
                .email("alex@example.com")
                .name("Alex Johnson")
                .role(Role.CANDIDATE)
                .build();

        candidateProfile = CandidateProfile.builder()
                .id("prof-1")
                .user(candidateUser)
                .headline("Senior Java Engineer")
                .build();
    }

    @Test
    @DisplayName("Should return candidate profile enriched with work experiences and education timeline")
    void getProfile_Success() {
        WorkExperience exp = WorkExperience.builder()
                .id("exp-1")
                .profile(candidateProfile)
                .company("Google")
                .title("Software Engineer")
                .currentlyWorking(true)
                .build();

        EducationHistory edu = EducationHistory.builder()
                .id("edu-1")
                .profile(candidateProfile)
                .institution("MIT")
                .degree("BS Computer Science")
                .build();

        when(userRepository.findById("cand-1")).thenReturn(Optional.of(candidateUser));
        when(candidateProfileRepository.findByUser(candidateUser)).thenReturn(Optional.of(candidateProfile));
        when(workExperienceRepository.findByProfileOrderByCreatedAtDesc(candidateProfile)).thenReturn(List.of(exp));
        when(educationHistoryRepository.findByProfileOrderByCreatedAtDesc(candidateProfile)).thenReturn(List.of(edu));

        CandidateProfileResponse response = candidateProfileService.getProfile(candidatePrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getHeadline()).isEqualTo("Senior Java Engineer");
        assertThat(response.getWorkExperiences()).hasSize(1);
        assertThat(response.getWorkExperiences().get(0).getCompany()).isEqualTo("Google");
        assertThat(response.getEducationHistory()).hasSize(1);
        assertThat(response.getEducationHistory().get(0).getInstitution()).isEqualTo("MIT");
    }

    @Test
    @DisplayName("Should add work experience to profile")
    void addWorkExperience_Success() {
        WorkExperienceDto dto = WorkExperienceDto.builder()
                .company("Meta")
                .title("Staff Engineer")
                .currentlyWorking(true)
                .build();

        when(userRepository.findById("cand-1")).thenReturn(Optional.of(candidateUser));
        when(candidateProfileRepository.findByUser(candidateUser)).thenReturn(Optional.of(candidateProfile));
        when(workExperienceRepository.save(any(WorkExperience.class))).thenAnswer(inv -> {
            WorkExperience w = inv.getArgument(0);
            w.setId("exp-new");
            return w;
        });

        WorkExperienceDto saved = candidateProfileService.addWorkExperience(candidatePrincipal, dto);

        assertThat(saved.getId()).isEqualTo("exp-new");
        assertThat(saved.getCompany()).isEqualTo("Meta");
        verify(workExperienceRepository).save(any(WorkExperience.class));
    }

    @Test
    @DisplayName("Should reject deleting experience belonging to another user")
    void deleteWorkExperience_Forbidden() {
        User otherUser = User.builder().id("other-id").build();
        CandidateProfile otherProfile = CandidateProfile.builder().user(otherUser).build();
        WorkExperience otherExp = WorkExperience.builder().id("exp-other").profile(otherProfile).build();

        when(workExperienceRepository.findById("exp-other")).thenReturn(Optional.of(otherExp));

        assertThatThrownBy(() -> candidateProfileService.deleteWorkExperience(candidatePrincipal, "exp-other"))
                .isInstanceOf(ForbiddenException.class);
    }
}

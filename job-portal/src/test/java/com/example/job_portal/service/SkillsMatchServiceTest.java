package com.example.job_portal.service;

import com.example.job_portal.dto.match.SkillsMatchResponse;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.Job;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.CandidateProfileRepository;
import com.example.job_portal.repository.JobRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SkillsMatchServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @InjectMocks
    private SkillsMatchServiceImpl skillsMatchService;

    private UserPrincipal candidatePrincipal;
    private Job job;

    @BeforeEach
    void setUp() {
        candidatePrincipal = UserPrincipal.builder()
                .id("cand-user-1")
                .email("alex@example.com")
                .name("Alex River")
                .build();

        job = Job.builder()
                .id("job-spring-react")
                .title("Full Stack Engineer")
                .tags(List.of("Spring Boot", "React.js", "PostgreSQL", "Docker"))
                .build();
    }

    @Test
    @DisplayName("Should calculate high match score when candidate has matching skills including synonyms")
    void calculateCandidateJobMatch_HighFit() {
        CandidateProfile profile = CandidateProfile.builder()
                .skills(List.of("spring", "react", "postgresql", "docker", "typescript"))
                .build();

        when(jobRepository.findById("job-spring-react")).thenReturn(Optional.of(job));
        when(candidateProfileRepository.findByUserId("cand-user-1")).thenReturn(Optional.of(profile));

        SkillsMatchResponse response = skillsMatchService.calculateCandidateJobMatch("job-spring-react", candidatePrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getScore()).isEqualTo(100);
        assertThat(response.getFitCategory()).isEqualTo("EXCELLENT_MATCH");
        assertThat(response.getMatchedSkills()).containsExactlyInAnyOrder("Spring Boot", "React.js", "PostgreSQL", "Docker");
        assertThat(response.getMissingSkills()).isEmpty();
    }

    @Test
    @DisplayName("Should detect skill gaps when candidate has partial overlap")
    void calculateCandidateJobMatch_PartialFit() {
        CandidateProfile profile = CandidateProfile.builder()
                .skills(List.of("react", "css", "html"))
                .build();

        when(jobRepository.findById("job-spring-react")).thenReturn(Optional.of(job));
        when(candidateProfileRepository.findByUserId("cand-user-1")).thenReturn(Optional.of(profile));

        SkillsMatchResponse response = skillsMatchService.calculateCandidateJobMatch("job-spring-react", candidatePrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getScore()).isEqualTo(25);
        assertThat(response.getFitCategory()).isEqualTo("LOW_FIT");
        assertThat(response.getMatchedSkills()).containsExactly("React.js");
        assertThat(response.getMissingSkills()).containsExactlyInAnyOrder("Spring Boot", "PostgreSQL", "Docker");
    }

    @Test
    @DisplayName("Should return 0 score and advisory message when candidate profile has no skills listed")
    void calculateCandidateJobMatch_NoSkills() {
        CandidateProfile emptyProfile = CandidateProfile.builder()
                .skills(List.of())
                .build();

        when(jobRepository.findById("job-spring-react")).thenReturn(Optional.of(job));
        when(candidateProfileRepository.findByUserId("cand-user-1")).thenReturn(Optional.of(emptyProfile));

        SkillsMatchResponse response = skillsMatchService.calculateCandidateJobMatch("job-spring-react", candidatePrincipal);

        assertThat(response.getScore()).isEqualTo(0);
        assertThat(response.getMatchedSkills()).isEmpty();
        assertThat(response.getMissingSkills()).hasSize(4);
    }
}

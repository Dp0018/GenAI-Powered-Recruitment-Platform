package com.example.job_portal.service;

import com.example.job_portal.dto.rag.*;
import com.example.job_portal.entity.*;
import com.example.job_portal.repository.*;
import com.example.job_portal.service.ai.GeminiService;
import com.example.job_portal.service.ai.ResumeRagServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeRagServiceTest {

    @Mock
    private ResumeDocumentChunkRepository chunkRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private CandidateResumeRepository candidateResumeRepository;

    @Mock
    private WorkExperienceRepository workExperienceRepository;

    @Mock
    private EducationHistoryRepository educationHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private GeminiService geminiService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private ResumeRagServiceImpl resumeRagService;

    private User candidateUser;
    private CandidateProfile candidateProfile;
    private Job testJob;
    private ResumeDocumentChunk testChunk;
    private List<Float> dummyVector;

    @BeforeEach
    void setUp() {
        candidateUser = User.builder()
                .id("cand-123")
                .name("Alex Mercer")
                .email("alex@example.com")
                .role(Role.CANDIDATE)
                .build();

        candidateProfile = CandidateProfile.builder()
                .id("prof-123")
                .user(candidateUser)
                .headline("Staff Distributed Systems Engineer")
                .bio("Specializing in Kafka, event architectures, and PostgreSQL.")
                .skills(List.of("Kafka", "Java", "PostgreSQL", "Go"))
                .yearsOfExperience(7)
                .location("San Francisco, CA")
                .build();

        testJob = Job.builder()
                .id("job-777")
                .title("Senior Infrastructure Engineer")
                .description("Build mission-critical event ingestion pipelines with Kafka.")
                .jobType(Job.JobType.FULL_TIME)
                .workplaceType(Job.WorkplaceType.REMOTE)
                .experienceLevel(Job.ExperienceLevel.SENIOR)
                .build();

        dummyVector = List.of(0.2f, 0.4f, 0.6f, 0.8f);

        testChunk = ResumeDocumentChunk.builder()
                .id("chunk-1")
                .candidate(candidateUser)
                .sectionType("EXPERIENCE")
                .chunkTitle("Senior Backend Engineer at Stripe")
                .chunkText("Scaled Kafka consumer pipelines handling 20,000 QPS with sub-15ms latency.")
                .embeddingJson("[0.2, 0.4, 0.6, 0.8]")
                .build();
    }

    @Test
    void searchTalentPool_ReturnsRankedCandidatesWithCitations() {
        when(geminiService.generateEmbedding(anyString())).thenReturn(dummyVector);
        when(candidateProfileRepository.findAll()).thenReturn(List.of(candidateProfile));
        when(chunkRepository.findByCandidateId("cand-123")).thenReturn(List.of(testChunk));
        when(geminiService.calculateCosineSimilarity(any(), any())).thenReturn(0.88);

        TalentSearchRequest request = TalentSearchRequest.builder()
                .query("Kafka streaming and distributed pipelines")
                .minYearsExperience(5)
                .limit(5)
                .build();

        TalentSearchResponse response = resumeRagService.searchTalentPool(request);

        assertNotNull(response);
        assertEquals(1, response.getTotalCandidatesMatched());
        TalentSearchResultDto result = response.getCandidates().get(0);
        assertEquals("Alex Mercer", result.getCandidateName());
        assertEquals(88, result.getMatchPercentage());
        assertFalse(result.getCitations().isEmpty());
        assertEquals("EXPERIENCE", result.getCitations().get(0).getSectionType());
    }

    @Test
    void evaluateResumeJobFit_ProducesGroundedBreakdown() {
        when(jobRepository.findById("job-777")).thenReturn(Optional.of(testJob));
        when(userRepository.findById("cand-123")).thenReturn(Optional.of(candidateUser));
        when(chunkRepository.findByCandidateId("cand-123")).thenReturn(List.of(testChunk));
        when(geminiService.generateEmbedding(anyString())).thenReturn(dummyVector);
        when(geminiService.calculateCosineSimilarity(any(), any())).thenReturn(0.85);

        ResumeJobFitResponse response = resumeRagService.evaluateResumeJobFit("job-777", "cand-123");

        assertNotNull(response);
        assertEquals("job-777", response.getJobId());
        assertEquals(85, response.getOverallFitScore());
        assertEquals("A", response.getFitGrade());
        assertEquals(4, response.getRequirementsBreakdown().size());
        assertEquals("VERIFIED_MATCH", response.getRequirementsBreakdown().get(0).getStatus());
    }

    @Test
    void optimizeResumeBullet_ReturnsLeveledSTARAlternatives() {
        ResumeOptimizeRequest request = ResumeOptimizeRequest.builder()
                .bulletText("Responsible for optimizing the database and helping with queries.")
                .targetRole("Senior Backend Engineer")
                .build();

        ResumeOptimizeResponse response = resumeRagService.optimizeResumeBullet(request);

        assertNotNull(response);
        assertNotNull(response.getOriginalBullet());
        assertTrue(response.getInitialImpactScore() < 70);
        assertFalse(response.getOptimizedOptions().isEmpty());
        assertEquals(3, response.getOptimizedOptions().size());
        assertTrue(response.getOptimizedOptions().get(0).getProjectedImpactScore() >= 85);
    }

    @Test
    void chatWithCandidateResume_ReturnsGroundedAnswerAndCitations() {
        when(userRepository.findById("cand-123")).thenReturn(Optional.of(candidateUser));
        when(chunkRepository.findByCandidateId("cand-123")).thenReturn(List.of(testChunk));
        when(geminiService.generateEmbedding(anyString())).thenReturn(dummyVector);
        when(geminiService.calculateCosineSimilarity(any(), any())).thenReturn(0.92);

        ResumeChatRequest request = ResumeChatRequest.builder()
                .question("What is their experience with Kafka and what scale did they handle?")
                .build();

        ResumeChatResponse response = resumeRagService.chatWithCandidateResume("cand-123", request);

        assertNotNull(response);
        assertNotNull(response.getAnswer());
        assertEquals("HIGH_CONFIDENCE", response.getConfidenceGrade());
        assertFalse(response.getCitations().isEmpty());
        assertTrue(response.getCitations().get(0).getSnippet().contains("Kafka"));
    }
}

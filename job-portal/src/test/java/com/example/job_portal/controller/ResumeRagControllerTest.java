package com.example.job_portal.controller;

import com.example.job_portal.common.exception.GlobalExceptionHandler;
import com.example.job_portal.dto.rag.*;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.ai.ResumeRagService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ResumeRagControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private ResumeRagService resumeRagService;

    @InjectMocks
    private ResumeRagController resumeRagController;

    private UserPrincipal testPrincipal;

    @BeforeEach
    void setUp() {
        User user = User.builder()
                .id("user-recruiter-1")
                .name("Alex Recruiter")
                .email("recruiter@acme.com")
                .role(Role.EMPLOYER_ADMIN)
                .banned(false)
                .build();
        testPrincipal = UserPrincipal.create(user, "password");

        HandlerMethodArgumentResolver authPrincipalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
            }

            @Override
            public Object resolveArgument(MethodParameter parameter,
                                          ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest,
                                          WebDataBinderFactory binderFactory) {
                return testPrincipal;
            }
        };

        mockMvc = MockMvcBuilders
                .standaloneSetup(resumeRagController)
                .setCustomArgumentResolvers(authPrincipalResolver)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/rag/talent-search - should return matching candidates")
    void shouldSearchTalentPool() throws Exception {
        TalentSearchResultDto match = TalentSearchResultDto.builder()
                .candidateId("cand-123")
                .candidateName("Alice Dev")
                .candidateEmail("alice@example.com")
                .headline("Backend Engineer")
                .location("San Francisco, CA")
                .yearsOfExperience(5)
                .skills(List.of("Spring Boot", "PostgreSQL", "Kafka"))
                .matchPercentage(92)
                .executiveSummary("Candidate has strong production microservices experience.")
                .citations(List.of(
                        RagCitationDto.builder()
                                .sectionType("EXPERIENCE")
                                .title("Senior Engineer at Stripe")
                                .snippet("Architected high throughput event bus")
                                .relevanceScore(0.92)
                                .build()
                ))
                .build();

        TalentSearchResponse response = TalentSearchResponse.builder()
                .query("Senior Spring Boot microservices engineer")
                .totalCandidatesMatched(1)
                .candidates(List.of(match))
                .talentLandscapeSummary("Candidate pool shows deep Java and cloud expertise.")
                .build();

        when(resumeRagService.searchTalentPool(any(TalentSearchRequest.class))).thenReturn(response);

        TalentSearchRequest request = TalentSearchRequest.builder()
                .query("Senior Spring Boot microservices engineer")
                .minYearsExperience(3)
                .limit(5)
                .build();

        mockMvc.perform(post("/api/v1/rag/talent-search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.candidates[0].candidateId", is("cand-123")))
                .andExpect(jsonPath("$.data.candidates[0].matchPercentage", is(92)));

        verify(resumeRagService, times(1)).searchTalentPool(any(TalentSearchRequest.class));
    }

    @Test
    @DisplayName("GET /api/v1/rag/jobs/{jobId}/fit - should evaluate job fit")
    void shouldEvaluateJobFit() throws Exception {
        ResumeJobFitResponse fitResponse = ResumeJobFitResponse.builder()
                .jobId("job-999")
                .jobTitle("Senior Backend Engineer")
                .candidateId("cand-123")
                .candidateName("Alice Dev")
                .overallFitScore(88)
                .fitGrade("A")
                .executiveSummary("Candidate matches most core requirements.")
                .verifiedStrengths(List.of("Java", "PostgreSQL"))
                .identifiedSkillGaps(List.of("Kubernetes"))
                .interviewRecommendations(List.of("Review container orchestration projects."))
                .build();

        when(resumeRagService.evaluateResumeJobFit(eq("job-999"), eq("cand-123"))).thenReturn(fitResponse);

        mockMvc.perform(get("/api/v1/rag/jobs/job-999/fit")
                        .param("candidateId", "cand-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.overallFitScore", is(88)))
                .andExpect(jsonPath("$.data.fitGrade", is("A")));

        verify(resumeRagService, times(1)).evaluateResumeJobFit("job-999", "cand-123");
    }

    @Test
    @DisplayName("POST /api/v1/rag/optimize-bullet - should return STAR / Google XYZ optimization")
    void shouldOptimizeResumeBullet() throws Exception {
        ResumeOptimizeResponse optResponse = ResumeOptimizeResponse.builder()
                .originalBullet("Managed database migrations.")
                .initialImpactScore(40)
                .starFrameworkGrade("WEAK")
                .critiqueAnalysis("Added measurable business metric and context.")
                .identifiedWeaknesses(List.of("Missing metric", "Passive voice"))
                .recommendedActionVerbs(List.of("Led", "Architected"))
                .optimizedOptions(List.of(
                        ResumeOptimizeResponse.OptimizedBulletDto.builder()
                                .level("Senior / Quantitative")
                                .bulletText("Led automated Zero-Downtime PostgreSQL database migrations for 15 microservices, cutting deployment window by 65%.")
                                .metricsHighlight("65% deployment reduction")
                                .projectedImpactScore(95)
                                .build()
                ))
                .build();

        when(resumeRagService.optimizeResumeBullet(any(ResumeOptimizeRequest.class))).thenReturn(optResponse);

        ResumeOptimizeRequest request = ResumeOptimizeRequest.builder()
                .bulletText("Managed database migrations.")
                .targetRole("Senior Database Engineer")
                .build();

        mockMvc.perform(post("/api/v1/rag/optimize-bullet")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.initialImpactScore", is(40)))
                .andExpect(jsonPath("$.data.optimizedOptions[0].projectedImpactScore", is(95)));

        verify(resumeRagService, times(1)).optimizeResumeBullet(any(ResumeOptimizeRequest.class));
    }

    @Test
    @DisplayName("POST /api/v1/rag/candidates/{candidateId}/chat - should return grounded answer with citations")
    void shouldChatWithResume() throws Exception {
        ResumeChatResponse chatResponse = ResumeChatResponse.builder()
                .question("Did they build CI/CD pipelines?")
                .answer("Yes, they designed GitHub Actions workflows for 20+ microservices.")
                .confidenceGrade("HIGH_CONFIDENCE")
                .citations(List.of(
                        RagCitationDto.builder()
                                .sectionType("EXPERIENCE")
                                .title("Lead Engineer")
                                .snippet("Automated CI/CD deployments using GitHub Actions and Helm.")
                                .relevanceScore(0.91)
                                .build()
                ))
                .build();

        when(resumeRagService.chatWithCandidateResume(eq("cand-123"), any(ResumeChatRequest.class))).thenReturn(chatResponse);

        ResumeChatRequest request = ResumeChatRequest.builder()
                .question("Did they build CI/CD pipelines?")
                .build();

        mockMvc.perform(post("/api/v1/rag/candidates/cand-123/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.confidenceGrade", is("HIGH_CONFIDENCE")))
                .andExpect(jsonPath("$.data.citations[0].sectionType", is("EXPERIENCE")));

        verify(resumeRagService, times(1)).chatWithCandidateResume(eq("cand-123"), any(ResumeChatRequest.class));
    }

    @Test
    @DisplayName("POST /api/v1/rag/candidates/{candidateId}/index - should trigger indexing")
    void shouldIndexCandidateProfile() throws Exception {
        doNothing().when(resumeRagService).indexCandidateProfile("cand-123");

        mockMvc.perform(post("/api/v1/rag/candidates/cand-123/index"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("INDEXED")));

        verify(resumeRagService, times(1)).indexCandidateProfile("cand-123");
    }
}

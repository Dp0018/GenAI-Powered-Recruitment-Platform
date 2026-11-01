package com.example.job_portal.controller;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.ai.ExplainableMatchResponse;
import com.example.job_portal.dto.ai.JobFraudAnalysisResponse;
import com.example.job_portal.dto.ai.ResumeAnomalyScanResponse;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.entity.*;
import com.example.job_portal.repository.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.JobService;
import com.example.job_portal.service.ai.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;
    private final JobService jobService;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final EducationHistoryRepository educationHistoryRepository;
    private final ObjectMapper objectMapper;

    // -------------------------------------------------------------------------------------------------
    // AI Fraud Detection & Trust Guardian
    // -------------------------------------------------------------------------------------------------

    @GetMapping("/ai/jobs/{jobId}/fraud-analysis")
    public ResponseEntity<ApiResponse<JobFraudAnalysisResponse>> getJobFraudAnalysis(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        JobFraudAnalysisResponse response;
        if (StringUtils.hasText(job.getFraudReasons())) {
            try {
                List<String> reasons = objectMapper.readValue(job.getFraudReasons(), List.class);
                response = JobFraudAnalysisResponse.builder()
                        .fraudScore(job.getFraudRiskScore())
                        .riskLevel(job.getFraudRiskLevel())
                        .isQuarantined(job.getIsQuarantined())
                        .reasons(reasons)
                        .safetyAdvice(job.getIsQuarantined()
                                ? List.of("This requisition is under Platform Security review.")
                                : List.of("Posting adheres to standard trust & safety benchmarks."))
                        .build();
            } catch (Exception e) {
                response = geminiService.analyzeJobFraud(job);
            }
        } else {
            response = geminiService.analyzeJobFraud(job);
        }

        return ResponseEntity.ok(ApiResponse.success("AI Fraud analysis retrieved", response));
    }

    @PostMapping("/ai/resumes/scan")
    public ResponseEntity<ApiResponse<ResumeAnomalyScanResponse>> scanResume(
            @RequestBody Map<String, String> payload
    ) {
        String text = payload.getOrDefault("resumeText", "");
        ResumeAnomalyScanResponse response = geminiService.scanResumeText(text);
        return ResponseEntity.ok(ApiResponse.success("Resume scanned for security anomalies", response));
    }

    // -------------------------------------------------------------------------------------------------
    // Explainable AI (XAI) Fit Engine
    // -------------------------------------------------------------------------------------------------

    @GetMapping("/ai/jobs/{jobId}/explain-match")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ExplainableMatchResponse>> explainJobMatchForCandidate(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        CandidateProfile profile = candidateProfileRepository.findByUserId(principal.getId())
                .orElse(CandidateProfile.builder()
                        .skills(Collections.emptyList())
                        .yearsOfExperience(1)
                        .headline("Candidate")
                        .build());

        List<WorkExperience> experiences = workExperienceRepository.findByCandidateProfileUserIdOrderByStartDateDesc(principal.getId());
        List<EducationHistory> education = educationHistoryRepository.findByCandidateProfileUserIdOrderByStartDateDesc(principal.getId());

        ExplainableMatchResponse response = geminiService.explainCandidateMatch(job, profile, experiences, education);
        return ResponseEntity.ok(ApiResponse.success("Explainable AI fit breakdown generated", response));
    }

    @GetMapping("/ai/applications/{applicationId}/explain-match")
    public ResponseEntity<ApiResponse<ExplainableMatchResponse>> explainApplicationMatch(
            @PathVariable String applicationId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        // Security authorization check
        boolean isCandidate = application.getCandidate().getId().equals(principal.getId());
        boolean isEmployer = principal.getCompanyId() != null &&
                application.getJob().getCompany() != null &&
                principal.getCompanyId().equals(application.getJob().getCompany().getId());

        if (!isCandidate && !isEmployer) {
            throw new ForbiddenException("You are not authorized to access AI fit evaluations for this application");
        }

        // Return cached explanation if present
        if (StringUtils.hasText(application.getXaiExplanation())) {
            try {
                ExplainableMatchResponse cached = objectMapper.readValue(application.getXaiExplanation(), ExplainableMatchResponse.class);
                return ResponseEntity.ok(ApiResponse.success("Explainable AI fit retrieved", cached));
            } catch (Exception ignored) {}
        }

        Job job = application.getJob();
        String candidateUserId = application.getCandidate().getId();

        CandidateProfile profile = candidateProfileRepository.findByUserId(candidateUserId)
                .orElse(CandidateProfile.builder()
                        .skills(Collections.emptyList())
                        .yearsOfExperience(1)
                        .headline(application.getCandidate().getName())
                        .build());

        List<WorkExperience> experiences = workExperienceRepository.findByCandidateProfileUserIdOrderByStartDateDesc(candidateUserId);
        List<EducationHistory> education = educationHistoryRepository.findByCandidateProfileUserIdOrderByStartDateDesc(candidateUserId);

        ExplainableMatchResponse response = geminiService.explainCandidateMatch(job, profile, experiences, education);

        // Cache on application entity
        try {
            application.setMatchScore(response.getOverallScore());
            application.setXaiExplanation(objectMapper.writeValueAsString(response));
            applicationRepository.save(application);
        } catch (Exception e) {
            log.warn("Could not cache XAI explanation on application: {}", e.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.success("Explainable AI fit generated", response));
    }

    // -------------------------------------------------------------------------------------------------
    // Platform Admin Quarantine Review Queue
    // -------------------------------------------------------------------------------------------------

    @GetMapping("/admin/fraud/quarantine")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getQuarantinedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobResponse> jobs = jobService.getQuarantinedJobs(page, size);
        return ResponseEntity.ok(ApiResponse.success("Quarantined jobs retrieved", jobs));
    }

    @PutMapping("/admin/fraud/jobs/{jobId}/approve")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> approveQuarantinedJob(
            @PathVariable String jobId
    ) {
        JobResponse response = jobService.approveQuarantinedJob(jobId);
        return ResponseEntity.ok(ApiResponse.success("Requisition cleared from quarantine and published", response));
    }

    @PutMapping("/admin/fraud/jobs/{jobId}/reject")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> rejectQuarantinedJob(
            @PathVariable String jobId
    ) {
        JobResponse response = jobService.rejectQuarantinedJob(jobId);
        return ResponseEntity.ok(ApiResponse.success("Requisition confirmed as fraudulent and permanently closed", response));
    }
}

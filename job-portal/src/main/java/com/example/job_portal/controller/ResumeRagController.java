package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.rag.*;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.ai.ResumeRagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/rag")
@RequiredArgsConstructor
public class ResumeRagController {

    private final ResumeRagService resumeRagService;

    /**
     * Feature 1: Recruiter Semantic Talent Pool Search (Talent Pool RAG)
     */
    @PostMapping("/talent-search")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'EMPLOYER_MEMBER', 'PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<TalentSearchResponse>> searchTalentPool(
            @Valid @RequestBody TalentSearchRequest request) {
        TalentSearchResponse response = resumeRagService.searchTalentPool(request);
        return ResponseEntity.ok(ApiResponse.success("Semantic talent search completed", response));
    }

    /**
     * Feature 2: Candidate & Recruiter Grounded Job Fit Analysis
     */
    @GetMapping("/jobs/{jobId}/fit")
    public ResponseEntity<ApiResponse<ResumeJobFitResponse>> getJobFitForCurrentUser(
            @PathVariable String jobId,
            @RequestParam(required = false) String candidateId,
            @AuthenticationPrincipal UserPrincipal principal) {
        String targetCandidateId = candidateId != null ? candidateId : principal.getId();
        ResumeJobFitResponse response = resumeRagService.evaluateResumeJobFit(jobId, targetCandidateId);
        return ResponseEntity.ok(ApiResponse.success("Grounded job-to-resume fit analysis generated", response));
    }

    /**
     * Feature 3: Candidate Resume Bullet-Point Impact Optimizer (STAR / Google XYZ)
     */
    @PostMapping("/optimize-bullet")
    public ResponseEntity<ApiResponse<ResumeOptimizeResponse>> optimizeResumeBullet(
            @Valid @RequestBody ResumeOptimizeRequest request) {
        ResumeOptimizeResponse response = resumeRagService.optimizeResumeBullet(request);
        return ResponseEntity.ok(ApiResponse.success("Resume bullet analyzed and optimized", response));
    }

    /**
     * Feature 4: Recruiter "Chat with Candidate Resume" (Application Inspector Q&A)
     */
    @PostMapping("/candidates/{candidateId}/chat")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'EMPLOYER_MEMBER', 'PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<ResumeChatResponse>> chatWithCandidateResume(
            @PathVariable String candidateId,
            @Valid @RequestBody ResumeChatRequest request) {
        ResumeChatResponse response = resumeRagService.chatWithCandidateResume(candidateId, request);
        return ResponseEntity.ok(ApiResponse.success("Grounded resume Q&A answer generated", response));
    }

    /**
     * Utility: Trigger Candidate Profile Vector Indexing
     */
    @PostMapping("/candidates/{candidateId}/index")
    public ResponseEntity<ApiResponse<Map<String, String>>> indexCandidate(
            @PathVariable String candidateId) {
        resumeRagService.indexCandidateProfile(candidateId);
        return ResponseEntity.ok(ApiResponse.success("Candidate profile vectorized and indexed",
                Map.of("candidateId", candidateId, "status", "INDEXED")));
    }
}


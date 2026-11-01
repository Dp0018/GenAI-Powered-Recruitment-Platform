package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.match.SkillsMatchResponse;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.SkillsMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SkillsMatchController {

    private final SkillsMatchService skillsMatchService;

    @GetMapping("/jobs/{jobId}/match")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<SkillsMatchResponse>> getCandidateJobMatch(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        SkillsMatchResponse response = skillsMatchService.calculateCandidateJobMatch(jobId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/applications/{applicationId}/match")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<SkillsMatchResponse>> getApplicationMatch(
            @PathVariable String applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        SkillsMatchResponse response = skillsMatchService.calculateApplicationMatch(applicationId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

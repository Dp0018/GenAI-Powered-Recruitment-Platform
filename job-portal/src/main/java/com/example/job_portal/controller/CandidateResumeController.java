package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.profile.CandidateResumeResponse;
import com.example.job_portal.dto.profile.CreateCandidateResumeRequest;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.CandidateResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/candidate/resumes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateResumeController {

    private final CandidateResumeService candidateResumeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CandidateResumeResponse>>> getMyResumes(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<CandidateResumeResponse> response = candidateResumeService.getMyResumes(currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CandidateResumeResponse>> addResume(
            @Valid @RequestBody CreateCandidateResumeRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CandidateResumeResponse response = candidateResumeService.addResume(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Resume added to library successfully", response));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<ApiResponse<CandidateResumeResponse>> setDefaultResume(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CandidateResumeResponse response = candidateResumeService.setDefaultResume(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Default resume updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        candidateResumeService.deleteResume(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Resume deleted from library", null));
    }
}

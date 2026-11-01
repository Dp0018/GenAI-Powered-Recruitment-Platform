package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.application.ApplicationResponse;
import com.example.job_portal.dto.application.SubmitApplicationRequest;
import com.example.job_portal.dto.application.UpdateApplicationStatusRequest;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitApplication(
            @PathVariable String jobId,
            @Valid @RequestBody SubmitApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ApplicationResponse response = applicationService.applyToJob(jobId, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/jobs/{jobId}/status")
    public ResponseEntity<ApiResponse<Boolean>> checkApplicationStatus(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean hasApplied = applicationService.hasApplied(jobId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(hasApplied));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(50, Math.max(1, size)));
        PagedResponse<ApplicationResponse> response = applicationService.getCandidateApplications(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/company")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getCompanyApplications(
            @RequestParam(required = false) String jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(50, Math.max(1, size)));
        PagedResponse<ApplicationResponse> response = applicationService.getCompanyApplications(currentUser, jobId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @PathVariable String applicationId,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ApplicationResponse response = applicationService.updateApplicationStatus(applicationId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", response));
    }

    @PutMapping("/{applicationId}/withdraw")
    public ResponseEntity<ApiResponse<ApplicationResponse>> withdrawApplication(
            @PathVariable String applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ApplicationResponse response = applicationService.withdrawApplication(applicationId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully", response));
    }
}

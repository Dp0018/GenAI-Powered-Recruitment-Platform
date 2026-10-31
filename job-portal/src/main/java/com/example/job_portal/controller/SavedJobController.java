package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping("/{jobId}/save")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Boolean>> toggleSaveJob(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isSaved = savedJobService.toggleSaveJob(jobId, currentUser);
        String message = isSaved ? "Job bookmarked successfully" : "Job bookmark removed";
        return ResponseEntity.ok(ApiResponse.success(message, isSaved));
    }

    @GetMapping("/{jobId}/is-saved")
    public ResponseEntity<ApiResponse<Boolean>> isJobSaved(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isSaved = savedJobService.isJobSaved(jobId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(isSaved));
    }

    @GetMapping("/saved")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getSavedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<JobResponse> savedJobs = savedJobService.getSavedJobs(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(savedJobs));
    }

    @DeleteMapping("/{jobId}/save")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Void>> removeSavedJob(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        savedJobService.removeSavedJob(jobId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Job bookmark removed", null));
    }
}

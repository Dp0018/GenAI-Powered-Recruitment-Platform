package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.job.CreateJobRequest;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // Public: Search and list published job requisitions
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workplaceType,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobResponse> jobs = jobService.searchPublishedJobs(
                query, location, workplaceType, jobType, page, size);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    // Public: View job details by slug
    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobBySlug(@PathVariable String slug) {
        JobResponse job = jobService.getJobBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    // Employer: List requisitions for their company
    @GetMapping("/my-company")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getMyCompanyJobs(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobResponse> jobs = jobService.getCompanyJobs(principal.getCompanyId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    // Employer: Create job requisition
    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody CreateJobRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        JobResponse job = jobService.createJob(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job requisition posted successfully", job));
    }

    // Employer: Update job requisition
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable String id,
            @Valid @RequestBody CreateJobRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        JobResponse job = jobService.updateJob(id, request, principal);
        return ResponseEntity.ok(ApiResponse.success("Job requisition updated successfully", job));
    }

    // Employer: Delete job requisition
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        jobService.deleteJob(id, principal);
        return ResponseEntity.ok(ApiResponse.message("Job requisition deleted successfully"));
    }
}

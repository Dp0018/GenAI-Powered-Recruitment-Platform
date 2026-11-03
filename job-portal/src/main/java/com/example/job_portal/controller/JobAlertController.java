package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.alert.CreateJobAlertRequest;
import com.example.job_portal.dto.alert.JobAlertResponse;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.JobAlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/job-alerts")
@RequiredArgsConstructor
public class JobAlertController {

    private final JobAlertService jobAlertService;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<JobAlertResponse>> createAlert(
            @Valid @RequestBody CreateJobAlertRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        JobAlertResponse response = jobAlertService.createAlert(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Job alert created successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<List<JobAlertResponse>>> getMyAlerts(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<JobAlertResponse> alerts = jobAlertService.getMyAlerts(currentUser);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @PatchMapping("/{alertId}/toggle")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<JobAlertResponse>> toggleAlert(
            @PathVariable String alertId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        JobAlertResponse response = jobAlertService.toggleAlert(currentUser, alertId);
        return ResponseEntity.ok(ApiResponse.success(
                response.isActive() ? "Job alert resumed" : "Job alert paused",
                response
        ));
    }

    @DeleteMapping("/{alertId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Void>> deleteAlert(
            @PathVariable String alertId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        jobAlertService.deleteAlert(currentUser, alertId);
        return ResponseEntity.ok(ApiResponse.success("Job alert deleted successfully", null));
    }

    @PostMapping("/trigger")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'PLATFORM_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerDigests() {
        int count = jobAlertService.triggerDigestExecution();
        return ResponseEntity.ok(ApiResponse.success(
                "Job alert digest sweep completed",
                Map.of("digestsDispatched", count)
        ));
    }
}

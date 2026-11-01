package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.interview.CreateInterviewRequest;
import com.example.job_portal.dto.interview.InterviewResponse;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYER', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<InterviewResponse>> scheduleInterview(
            @Valid @RequestBody CreateInterviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        InterviewResponse response = interviewService.scheduleInterview(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Interview scheduled successfully", response));
    }

    @GetMapping("/employer")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getEmployerInterviews(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<InterviewResponse> responses = interviewService.getEmployerInterviews(currentUser);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getCandidateInterviews(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<InterviewResponse> responses = interviewService.getCandidateInterviews(currentUser);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<InterviewResponse>> cancelInterview(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        InterviewResponse response = interviewService.cancelInterview(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Interview cancelled successfully", response));
    }

    @GetMapping(value = "/{id}/invite.ics", produces = "text/calendar")
    public ResponseEntity<byte[]> downloadCalendarIcs(@PathVariable String id) {
        byte[] icsData = interviewService.getCalendarIcs(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"interview-" + id + ".ics\"")
                .contentType(MediaType.parseMediaType("text/calendar; charset=UTF-8"))
                .body(icsData);
    }
}

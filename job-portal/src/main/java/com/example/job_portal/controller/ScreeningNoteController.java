package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.application.ApplicationScorecardSummaryResponse;
import com.example.job_portal.dto.application.CreateScreeningNoteRequest;
import com.example.job_portal.dto.application.ScreeningNoteResponse;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.ScreeningNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications/{applicationId}/screening-notes")
@RequiredArgsConstructor
public class ScreeningNoteController {

    private final ScreeningNoteService screeningNoteService;

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'EMPLOYER', 'RECRUITER', 'PLATFORM_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ScreeningNoteResponse>> addScreeningNote(
            @PathVariable String applicationId,
            @Valid @RequestBody CreateScreeningNoteRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ScreeningNoteResponse response = screeningNoteService.addNote(applicationId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Internal screening note recorded successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'EMPLOYER', 'RECRUITER', 'PLATFORM_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationScorecardSummaryResponse>> getScorecard(
            @PathVariable String applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ApplicationScorecardSummaryResponse response = screeningNoteService.getScorecard(applicationId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.company.InviteTeamMemberRequest;
import com.example.job_portal.dto.company.TeamMemberResponse;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.CompanyTeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/company/team")
@RequiredArgsConstructor
public class CompanyTeamController {

    private final CompanyTeamService companyTeamService;

    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<List<TeamMemberResponse>>> getTeamMembers(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<TeamMemberResponse> members = companyTeamService.getTeamMembers(currentUser);
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    @PostMapping("/invite")
    @PreAuthorize("hasRole('EMPLOYER_ADMIN')")
    public ResponseEntity<ApiResponse<TeamMemberResponse>> inviteTeamMember(
            @Valid @RequestBody InviteTeamMemberRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        TeamMemberResponse response = companyTeamService.inviteTeamMember(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team member invitation sent successfully", response));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('EMPLOYER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeTeamMember(
            @PathVariable String userId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        companyTeamService.removeTeamMember(userId, currentUser);
        return ResponseEntity.ok(ApiResponse.message("Team member removed successfully"));
    }
}

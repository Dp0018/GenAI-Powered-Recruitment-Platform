package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.profile.CandidateProfileResponse;
import com.example.job_portal.dto.profile.EducationHistoryDto;
import com.example.job_portal.dto.profile.UpdateCandidateProfileRequest;
import com.example.job_portal.dto.profile.WorkExperienceDto;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.CandidateProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/candidate/profile")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;
    private final com.example.job_portal.service.ResumeParserService resumeParserService;

    @PostMapping("/parse-resume")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<com.example.job_portal.dto.profile.ParsedResumeDto>> parseResume(
            @RequestBody com.example.job_portal.dto.profile.ParseResumeRequest request
    ) {
        com.example.job_portal.dto.profile.ParsedResumeDto parsed = resumeParserService.parseResume(
                request != null ? request.getResumeText() : null,
                request != null ? request.getResumeUrl() : null
        );
        return ResponseEntity.ok(ApiResponse.success("Resume parsed successfully", parsed));
    }

    @GetMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CandidateProfileResponse profile = candidateProfileService.getProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/candidate/{userId}")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'EMPLOYER', 'RECRUITER', 'PLATFORM_ADMIN', 'ADMIN', 'CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> getCandidateProfileByUserId(
            @PathVariable String userId
    ) {
        CandidateProfileResponse profile = candidateProfileService.getCandidateProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateCandidateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CandidateProfileResponse profile = candidateProfileService.updateProfile(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @PostMapping("/experience")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<WorkExperienceDto>> addExperience(
            @Valid @RequestBody WorkExperienceDto request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        WorkExperienceDto result = candidateProfileService.addWorkExperience(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Work experience added successfully", result));
    }

    @PutMapping("/experience/{experienceId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<WorkExperienceDto>> updateExperience(
            @PathVariable String experienceId,
            @Valid @RequestBody WorkExperienceDto request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        WorkExperienceDto result = candidateProfileService.updateWorkExperience(currentUser, experienceId, request);
        return ResponseEntity.ok(ApiResponse.success("Work experience updated successfully", result));
    }

    @DeleteMapping("/experience/{experienceId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(
            @PathVariable String experienceId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        candidateProfileService.deleteWorkExperience(currentUser, experienceId);
        return ResponseEntity.ok(ApiResponse.success("Work experience deleted successfully", null));
    }

    @PostMapping("/education")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<EducationHistoryDto>> addEducation(
            @Valid @RequestBody EducationHistoryDto request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        EducationHistoryDto result = candidateProfileService.addEducationHistory(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Education record added successfully", result));
    }

    @PutMapping("/education/{educationId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<EducationHistoryDto>> updateEducation(
            @PathVariable String educationId,
            @Valid @RequestBody EducationHistoryDto request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        EducationHistoryDto result = candidateProfileService.updateEducationHistory(currentUser, educationId, request);
        return ResponseEntity.ok(ApiResponse.success("Education record updated successfully", result));
    }

    @DeleteMapping("/education/{educationId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @PathVariable String educationId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        candidateProfileService.deleteEducationHistory(currentUser, educationId);
        return ResponseEntity.ok(ApiResponse.success("Education record deleted successfully", null));
    }
}

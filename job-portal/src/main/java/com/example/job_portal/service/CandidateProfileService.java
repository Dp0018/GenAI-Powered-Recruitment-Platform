package com.example.job_portal.service;

import com.example.job_portal.dto.profile.CandidateProfileResponse;
import com.example.job_portal.dto.profile.EducationHistoryDto;
import com.example.job_portal.dto.profile.UpdateCandidateProfileRequest;
import com.example.job_portal.dto.profile.WorkExperienceDto;
import com.example.job_portal.security.UserPrincipal;

public interface CandidateProfileService {

    CandidateProfileResponse getProfile(UserPrincipal currentUser);

    CandidateProfileResponse getCandidateProfileByUserId(String candidateUserId);

    CandidateProfileResponse updateProfile(UserPrincipal currentUser, UpdateCandidateProfileRequest request);

    WorkExperienceDto addWorkExperience(UserPrincipal currentUser, WorkExperienceDto request);

    WorkExperienceDto updateWorkExperience(UserPrincipal currentUser, String experienceId, WorkExperienceDto request);

    void deleteWorkExperience(UserPrincipal currentUser, String experienceId);

    EducationHistoryDto addEducationHistory(UserPrincipal currentUser, EducationHistoryDto request);

    EducationHistoryDto updateEducationHistory(UserPrincipal currentUser, String educationId, EducationHistoryDto request);

    void deleteEducationHistory(UserPrincipal currentUser, String educationId);
}

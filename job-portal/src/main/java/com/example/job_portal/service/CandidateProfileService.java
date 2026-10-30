package com.example.job_portal.service;

import com.example.job_portal.dto.profile.CandidateProfileResponse;
import com.example.job_portal.dto.profile.UpdateCandidateProfileRequest;
import com.example.job_portal.security.UserPrincipal;

public interface CandidateProfileService {

    CandidateProfileResponse getProfile(UserPrincipal currentUser);

    CandidateProfileResponse updateProfile(UserPrincipal currentUser, UpdateCandidateProfileRequest request);
}

package com.example.job_portal.service;

import com.example.job_portal.dto.profile.CandidateResumeResponse;
import com.example.job_portal.dto.profile.CreateCandidateResumeRequest;
import com.example.job_portal.security.UserPrincipal;

import java.util.List;

public interface CandidateResumeService {

    List<CandidateResumeResponse> getMyResumes(UserPrincipal currentUser);

    CandidateResumeResponse addResume(CreateCandidateResumeRequest request, UserPrincipal currentUser);

    CandidateResumeResponse setDefaultResume(String resumeId, UserPrincipal currentUser);

    void deleteResume(String resumeId, UserPrincipal currentUser);
}

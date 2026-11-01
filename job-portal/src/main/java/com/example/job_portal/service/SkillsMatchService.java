package com.example.job_portal.service;

import com.example.job_portal.dto.match.SkillsMatchResponse;
import com.example.job_portal.security.UserPrincipal;

public interface SkillsMatchService {

    SkillsMatchResponse calculateCandidateJobMatch(String jobId, UserPrincipal currentUser);

    SkillsMatchResponse calculateApplicationMatch(String applicationId, UserPrincipal currentUser);
}

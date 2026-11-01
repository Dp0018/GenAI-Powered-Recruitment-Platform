package com.example.job_portal.service;

import com.example.job_portal.dto.application.ApplicationScorecardSummaryResponse;
import com.example.job_portal.dto.application.CreateScreeningNoteRequest;
import com.example.job_portal.dto.application.ScreeningNoteResponse;
import com.example.job_portal.security.UserPrincipal;

public interface ScreeningNoteService {

    ScreeningNoteResponse addNote(String applicationId, CreateScreeningNoteRequest request, UserPrincipal currentUser);

    ApplicationScorecardSummaryResponse getScorecard(String applicationId, UserPrincipal currentUser);
}

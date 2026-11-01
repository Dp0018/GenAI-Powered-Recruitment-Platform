package com.example.job_portal.service;

import com.example.job_portal.dto.interview.CreateInterviewRequest;
import com.example.job_portal.dto.interview.InterviewResponse;
import com.example.job_portal.security.UserPrincipal;

import java.util.List;

public interface InterviewService {

    InterviewResponse scheduleInterview(CreateInterviewRequest request, UserPrincipal currentUser);

    List<InterviewResponse> getEmployerInterviews(UserPrincipal currentUser);

    List<InterviewResponse> getCandidateInterviews(UserPrincipal currentUser);

    InterviewResponse cancelInterview(String interviewId, UserPrincipal currentUser);

    byte[] getCalendarIcs(String interviewId);
}

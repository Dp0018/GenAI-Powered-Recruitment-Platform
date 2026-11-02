package com.example.job_portal.service.ai;

import com.example.job_portal.dto.ai.ExplainableMatchResponse;
import com.example.job_portal.dto.ai.JobFraudAnalysisResponse;
import com.example.job_portal.dto.ai.ResumeAnomalyScanResponse;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.EducationHistory;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.WorkExperience;

import java.util.List;

public interface GeminiService {

    JobFraudAnalysisResponse analyzeJobFraud(Job job);

    ExplainableMatchResponse explainCandidateMatch(
            Job job,
            CandidateProfile profile,
            List<WorkExperience> workExperiences,
            List<EducationHistory> educationHistory
    );

    ResumeAnomalyScanResponse scanResumeText(String resumeText);

    String generateJobDescription(String jobTitle, String notes);
}

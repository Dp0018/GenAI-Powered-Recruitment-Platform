package com.example.job_portal.service.ai;

import com.example.job_portal.dto.rag.*;

public interface ResumeRagService {

    void indexCandidateProfile(String candidateUserId);

    void indexResumeText(String candidateUserId, String resumeId, String resumeTitle, String resumeText);

    TalentSearchResponse searchTalentPool(TalentSearchRequest request);

    ResumeJobFitResponse evaluateResumeJobFit(String jobId, String candidateUserId);

    ResumeOptimizeResponse optimizeResumeBullet(ResumeOptimizeRequest request);

    ResumeChatResponse chatWithCandidateResume(String candidateUserId, ResumeChatRequest request);
}


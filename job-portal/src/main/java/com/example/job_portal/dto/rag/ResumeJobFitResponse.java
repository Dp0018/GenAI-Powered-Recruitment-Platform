package com.example.job_portal.dto.rag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeJobFitResponse {

    private String jobId;
    private String jobTitle;
    private String candidateId;
    private String candidateName;
    private Integer overallFitScore;
    private String fitGrade; // "A+", "A", "B", "C"
    private String executiveSummary;

    @Builder.Default
    private List<RequirementFitDto> requirementsBreakdown = new ArrayList<>();

    @Builder.Default
    private List<String> verifiedStrengths = new ArrayList<>();

    @Builder.Default
    private List<String> identifiedSkillGaps = new ArrayList<>();

    @Builder.Default
    private List<String> interviewRecommendations = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequirementFitDto {
        private String requirement;
        private String status; // "VERIFIED_MATCH", "PARTIAL_MATCH", "MISSING_EVIDENCE"
        private Integer matchScore;
        private String evidenceCitation;
        private String analysis;
    }
}


package com.example.job_portal.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExplainableMatchResponse {
    private Integer overallScore;                     // 0 to 100
    private String matchGrade;                        // "EXCELLENT", "STRONG", "MODERATE", "LOW"
    private Integer skillsScore;                      // 0 to 100
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private Integer experienceScore;                  // 0 to 100
    private String experienceAssessment;
    private Integer domainScore;                      // 0 to 100
    private String domainAssessment;
    private Integer workplaceScore;                   // 0 to 100
    private String executiveSummary;                  // Brief narrative for hiring managers
    private List<String> keyStrengths;                // 2-3 specific evidence-based strengths
    private List<String> potentialGaps;               // 1-2 constructive growth areas
    private List<String> candidateActionableAdvice;   // What the candidate can learn / improve
    private String biasAndFairnessNotice;             // Compliance & DE&I audit statement
}

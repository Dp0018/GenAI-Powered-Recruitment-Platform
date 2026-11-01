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
public class JobFraudAnalysisResponse {
    private Integer fraudScore;          // 0 to 100
    private String riskLevel;            // "LOW", "MEDIUM", "HIGH"
    private Boolean isQuarantined;       // true if score >= 70
    private List<String> reasons;        // Key indicators / red flags detected
    private List<String> safetyAdvice;   // Advice for candidates/admin
}

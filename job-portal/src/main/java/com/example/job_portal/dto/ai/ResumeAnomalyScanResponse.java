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
public class ResumeAnomalyScanResponse {
    private Integer anomalyScore;               // 0 (clean) to 100 (high risk)
    private String riskLevel;                   // "CLEAN", "SUSPICIOUS", "FLAGGED"
    private Boolean promptInjectionDetected;
    private List<String> detectedAnomalies;     // e.g. "Impossible career dates", "Prompt injection attack detected"
    private String assessmentSummary;
}

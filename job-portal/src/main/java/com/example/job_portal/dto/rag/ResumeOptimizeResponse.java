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
public class ResumeOptimizeResponse {

    private String originalBullet;
    private Integer initialImpactScore; // 0-100
    private String starFrameworkGrade;  // "STRONG", "NEEDS_METRICS", "PASSIVE_VOICE", "WEAK"
    private String critiqueAnalysis;

    @Builder.Default
    private List<String> identifiedWeaknesses = new ArrayList<>();

    @Builder.Default
    private List<OptimizedBulletDto> optimizedOptions = new ArrayList<>();

    @Builder.Default
    private List<String> recommendedActionVerbs = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptimizedBulletDto {
        private String level; // "Senior / Quantitative", "Staff / Architectural Impact", "Lead / Scaled Execution"
        private String bulletText;
        private String metricsHighlight;
        private Integer projectedImpactScore;
    }
}


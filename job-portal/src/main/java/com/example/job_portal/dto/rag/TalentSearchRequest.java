package com.example.job_portal.dto.rag;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TalentSearchRequest {

    @NotBlank(message = "Search query is required")
    private String query;

    private Integer minYearsExperience;

    private String requiredSkill;

    @Builder.Default
    private Integer limit = 10;
}


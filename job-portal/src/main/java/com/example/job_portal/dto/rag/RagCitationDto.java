package com.example.job_portal.dto.rag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagCitationDto {
    private String sectionType;
    private String title;
    private String snippet;
    private Double relevanceScore;
}


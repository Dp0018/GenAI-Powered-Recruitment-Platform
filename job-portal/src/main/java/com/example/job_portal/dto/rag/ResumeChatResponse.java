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
public class ResumeChatResponse {

    private String question;
    private String answer;
    private String confidenceGrade; // "HIGH_CONFIDENCE", "MODERATE", "LOW_EVIDENCE"

    @Builder.Default
    private List<RagCitationDto> citations = new ArrayList<>();
}


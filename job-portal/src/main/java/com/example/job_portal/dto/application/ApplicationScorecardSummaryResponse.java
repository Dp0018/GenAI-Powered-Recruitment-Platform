package com.example.job_portal.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationScorecardSummaryResponse {

    private String applicationId;
    private Double averageRating;
    private Integer totalReviews;
    private List<ScreeningNoteResponse> notes;
}

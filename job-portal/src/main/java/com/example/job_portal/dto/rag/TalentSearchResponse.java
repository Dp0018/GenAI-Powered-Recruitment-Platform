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
public class TalentSearchResponse {

    private String query;
    private String talentLandscapeSummary;
    private Integer totalCandidatesMatched;

    @Builder.Default
    private List<TalentSearchResultDto> candidates = new ArrayList<>();
}


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
public class TalentSearchResultDto {

    private String candidateId;
    private String candidateName;
    private String candidateEmail;
    private String headline;
    private String location;
    private Integer yearsOfExperience;
    private String resumeUrl;

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    private Integer matchPercentage;

    private String executiveSummary;

    @Builder.Default
    private List<RagCitationDto> citations = new ArrayList<>();
}


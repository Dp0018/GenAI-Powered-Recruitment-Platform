package com.example.job_portal.dto.match;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillsMatchResponse {

    private int score;
    private String fitCategory;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String summary;
}

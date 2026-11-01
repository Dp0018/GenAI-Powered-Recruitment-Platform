package com.example.job_portal.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParsedResumeDto {

    private String name;
    private String email;
    private String phone;
    private String headline;
    private String bio;
    private List<String> skills;
    private List<WorkExperienceDto> workExperiences;
    private List<EducationHistoryDto> educationHistory;
    private String rawText;
}

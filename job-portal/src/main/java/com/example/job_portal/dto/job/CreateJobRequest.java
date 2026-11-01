package com.example.job_portal.dto.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 200, message = "Job title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requirements;

    @NotBlank(message = "Location is required")
    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String location;

    @NotBlank(message = "Workplace type is required (REMOTE, HYBRID, ONSITE)")
    private String workplaceType;

    @NotBlank(message = "Job type is required (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)")
    private String jobType;

    private Integer minSalary;
    private Integer maxSalary;
    private String currency;
    private String salaryPeriod;
    private Boolean hasEquity;
    private String equityRange;
    private Boolean hasSignOnBonus;
    private Integer signOnBonus;
    private Integer annualBonusPercentage;
    private String compensationNotes;

    private List<String> tags;
    private List<String> benefits;
    private Integer expirationDays;

    private String status;
    private String experienceLevel;
    private List<JobQuestionDto> screeningQuestions;
}


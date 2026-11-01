package com.example.job_portal.dto.profile;

import com.example.job_portal.entity.WorkExperience;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkExperienceDto {

    private String id;

    @NotBlank(message = "Company name is required")
    @Size(max = 140, message = "Company cannot exceed 140 characters")
    private String company;

    @NotBlank(message = "Job title is required")
    @Size(max = 140, message = "Title cannot exceed 140 characters")
    private String title;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @Size(max = 40, message = "Start date cannot exceed 40 characters")
    private String startDate;

    @Size(max = 40, message = "End date cannot exceed 40 characters")
    private String endDate;

    @Builder.Default
    private boolean currentlyWorking = false;

    @Size(max = 3000, message = "Description cannot exceed 3000 characters")
    private String description;

    private Instant createdAt;

    public static WorkExperienceDto from(WorkExperience exp) {
        if (exp == null) return null;
        return WorkExperienceDto.builder()
                .id(exp.getId())
                .company(exp.getCompany())
                .title(exp.getTitle())
                .location(exp.getLocation())
                .startDate(exp.getStartDate())
                .endDate(exp.getEndDate())
                .currentlyWorking(exp.isCurrentlyWorking())
                .description(exp.getDescription())
                .createdAt(exp.getCreatedAt())
                .build();
    }
}

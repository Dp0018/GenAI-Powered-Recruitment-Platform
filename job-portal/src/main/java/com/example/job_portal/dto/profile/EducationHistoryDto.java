package com.example.job_portal.dto.profile;

import com.example.job_portal.entity.EducationHistory;
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
public class EducationHistoryDto {

    private String id;

    @NotBlank(message = "Institution name is required")
    @Size(max = 180, message = "Institution cannot exceed 180 characters")
    private String institution;

    @NotBlank(message = "Degree is required")
    @Size(max = 140, message = "Degree cannot exceed 140 characters")
    private String degree;

    @Size(max = 140, message = "Field of study cannot exceed 140 characters")
    private String fieldOfStudy;

    @Size(max = 40, message = "Start date cannot exceed 40 characters")
    private String startDate;

    @Size(max = 40, message = "End date cannot exceed 40 characters")
    private String endDate;

    @Size(max = 30, message = "Grade/GPA cannot exceed 30 characters")
    private String gradeOrGpa;

    @Size(max = 3000, message = "Description cannot exceed 3000 characters")
    private String description;

    private Instant createdAt;

    public static EducationHistoryDto from(EducationHistory edu) {
        if (edu == null) return null;
        return EducationHistoryDto.builder()
                .id(edu.getId())
                .institution(edu.getInstitution())
                .degree(edu.getDegree())
                .fieldOfStudy(edu.getFieldOfStudy())
                .startDate(edu.getStartDate())
                .endDate(edu.getEndDate())
                .gradeOrGpa(edu.getGradeOrGpa())
                .description(edu.getDescription())
                .createdAt(edu.getCreatedAt())
                .build();
    }
}

package com.example.job_portal.dto.alert;

import com.example.job_portal.entity.JobAlert.AlertFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobAlertRequest {

    @NotBlank(message = "Search keyword is required")
    @Size(max = 120, message = "Keyword cannot exceed 120 characters")
    private String keyword;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @Builder.Default
    private AlertFrequency frequency = AlertFrequency.DAILY;
}

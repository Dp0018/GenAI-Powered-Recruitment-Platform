package com.example.job_portal.dto.interview;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInterviewRequest {

    @NotBlank(message = "Application ID is required")
    private String applicationId;

    @NotBlank(message = "Interview title is required")
    private String title;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Interview must be scheduled in the future")
    private Instant scheduledAt;

    @Builder.Default
    private Integer durationMinutes = 45;

    private String meetingLink;

    private String notes;
}

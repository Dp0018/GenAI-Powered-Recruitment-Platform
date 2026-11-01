package com.example.job_portal.dto.interview;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposeInterviewSlotsRequest {

    @NotBlank(message = "Application ID is required")
    private String applicationId;

    @NotBlank(message = "Interview title is required")
    private String title;

    @NotEmpty(message = "At least one time slot must be proposed")
    private List<Instant> proposedSlots;

    @Builder.Default
    private Integer durationMinutes = 45;

    private String meetingLink;

    private String notes;
}

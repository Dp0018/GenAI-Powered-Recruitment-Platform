package com.example.job_portal.dto.interview;

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
public class SelectInterviewSlotRequest {

    @NotNull(message = "Selected slot is required")
    private Instant selectedSlot;
}

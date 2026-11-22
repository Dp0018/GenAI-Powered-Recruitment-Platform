package com.example.job_portal.dto.rag;

import jakarta.validation.constraints.NotBlank;
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
public class ResumeOptimizeRequest {

    @NotBlank(message = "Bullet point or experience text is required")
    private String bulletText;

    private String targetRole;

    private String industry;
}


package com.example.job_portal.dto.application;

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
public class SubmitApplicationRequest {

    @NotBlank(message = "Resume link or document URL is required")
    @Size(max = 500, message = "Resume URL must be under 500 characters")
    private String resumeUrl;

    @Size(max = 5000, message = "Cover note must be under 5000 characters")
    private String coverLetter;

    @Size(max = 30, message = "Phone number must be under 30 characters")
    private String phone;
}

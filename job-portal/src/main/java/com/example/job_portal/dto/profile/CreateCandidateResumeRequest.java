package com.example.job_portal.dto.profile;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCandidateResumeRequest {

    @NotBlank(message = "Resume title / label is required (e.g. Fullstack Engineer, DevOps Lead)")
    private String title;

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    private String fileType;
    private Long fileSize;
    private Boolean isDefault;
}

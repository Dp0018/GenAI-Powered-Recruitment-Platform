package com.example.job_portal.dto.profile;

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
public class UpdateCandidateProfileRequest {

    @Size(max = 120, message = "Name cannot exceed 120 characters")
    private String name;

    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    @Size(max = 500, message = "Avatar URL cannot exceed 500 characters")
    private String avatarUrl;

    @Size(max = 180, message = "Headline cannot exceed 180 characters")
    private String headline;

    @Size(max = 3000, message = "Bio cannot exceed 3000 characters")
    private String bio;

    @Size(max = 120, message = "Location cannot exceed 120 characters")
    private String location;

    @Size(max = 300, message = "Website URL cannot exceed 300 characters")
    private String websiteUrl;

    @Size(max = 300, message = "GitHub URL cannot exceed 300 characters")
    private String githubUrl;

    @Size(max = 300, message = "LinkedIn URL cannot exceed 300 characters")
    private String linkedinUrl;

    @Size(max = 500, message = "Resume URL cannot exceed 500 characters")
    private String resumeUrl;

    @Size(max = 200, message = "Resume filename cannot exceed 200 characters")
    private String resumeFileName;

    private List<String> skills;

    private Integer yearsOfExperience;

    @Size(max = 120, message = "Current role cannot exceed 120 characters")
    private String currentRole;

    @Size(max = 120, message = "Current company cannot exceed 120 characters")
    private String currentCompany;
}

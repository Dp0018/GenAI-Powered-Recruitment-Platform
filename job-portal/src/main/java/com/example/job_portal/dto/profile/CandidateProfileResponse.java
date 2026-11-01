package com.example.job_portal.dto.profile;

import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileResponse {
    private String id;
    private String userId;
    private String name;
    private String email;
    private boolean emailVerified;
    private String phone;
    private String avatarUrl;

    private String headline;
    private String bio;
    private String location;
    private String websiteUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String resumeUrl;
    private String resumeFileName;
    private List<String> skills;
    private Integer yearsOfExperience;
    private String currentRole;
    private String currentCompany;

    @Builder.Default
    private List<WorkExperienceDto> workExperiences = new ArrayList<>();

    @Builder.Default
    private List<EducationHistoryDto> educationHistory = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;

    public static CandidateProfileResponse from(CandidateProfile profile, User user) {
        return from(profile, user, null, null);
    }

    public static CandidateProfileResponse from(
            CandidateProfile profile,
            User user,
            List<com.example.job_portal.entity.WorkExperience> experiences,
            List<com.example.job_portal.entity.EducationHistory> educations
    ) {
        List<WorkExperienceDto> expDtos = experiences != null
                ? experiences.stream().map(WorkExperienceDto::from).toList()
                : new ArrayList<>();

        List<EducationHistoryDto> eduDtos = educations != null
                ? educations.stream().map(EducationHistoryDto::from).toList()
                : new ArrayList<>();

        if (profile == null) {
            return CandidateProfileResponse.builder()
                    .userId(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .emailVerified(user.isEmailVerified())
                    .phone(user.getPhone())
                    .avatarUrl(user.getImage())
                    .skills(new ArrayList<>())
                    .workExperiences(expDtos)
                    .educationHistory(eduDtos)
                    .build();
        }

        return CandidateProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .phone(user.getPhone())
                .avatarUrl(user.getImage())
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .location(profile.getLocation())
                .websiteUrl(profile.getWebsiteUrl())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .resumeUrl(profile.getResumeUrl())
                .resumeFileName(profile.getResumeFileName())
                .skills(profile.getSkills() != null ? new ArrayList<>(profile.getSkills()) : new ArrayList<>())
                .yearsOfExperience(profile.getYearsOfExperience())
                .currentRole(profile.getCurrentRole())
                .currentCompany(profile.getCurrentCompany())
                .workExperiences(expDtos)
                .educationHistory(eduDtos)
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}

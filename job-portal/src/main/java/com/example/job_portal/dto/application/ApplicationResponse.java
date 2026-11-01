package com.example.job_portal.dto.application;

import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.Company.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private String id;
    private JobSummary job;
    private CandidateSummary candidate;
    private String resumeUrl;
    private String coverLetter;
    private String phone;
    private String feedbackNote;
    private String referralCode;
    private String referredBy;
    private Application.ApplicationStatus status;
    private java.util.List<ScreeningAnswerDto> screeningAnswers;
    private Double averageRating;
    private Integer reviewCount;
    private Integer matchScore;
    private String xaiExplanation;
    private Integer resumeAnomalyScore;
    private String resumeAnomalyFlags;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobSummary {
        private String id;
        private String title;
        private String slug;
        private String location;
        private String workplaceType;
        private String jobType;
        private String companyName;
        private VerificationStatus companyVerificationStatus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateSummary {
        private String id;
        private String name;
        private String email;
        private String phone;
    }

    public static ApplicationResponse fromEntity(Application app) {
        JobSummary jobSummary = null;
        if (app.getJob() != null) {
            jobSummary = JobSummary.builder()
                    .id(app.getJob().getId())
                    .title(app.getJob().getTitle())
                    .slug(app.getJob().getSlug())
                    .location(app.getJob().getLocation())
                    .workplaceType(app.getJob().getWorkplaceType() != null ? app.getJob().getWorkplaceType().name() : null)
                    .jobType(app.getJob().getJobType() != null ? app.getJob().getJobType().name() : null)
                    .companyName(app.getJob().getCompany() != null ? app.getJob().getCompany().getName() : null)
                    .companyVerificationStatus(app.getJob().getCompany() != null ? app.getJob().getCompany().getVerificationStatus() : null)
                    .build();
        }

        CandidateSummary candidateSummary = null;
        if (app.getCandidate() != null) {
            candidateSummary = CandidateSummary.builder()
                    .id(app.getCandidate().getId())
                    .name(app.getCandidate().getName())
                    .email(app.getCandidate().getEmail())
                    .phone(app.getCandidate().getPhone())
                    .build();
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .job(jobSummary)
                .candidate(candidateSummary)
                .resumeUrl(app.getResumeUrl())
                .coverLetter(app.getCoverLetter())
                .phone(app.getPhone())
                .feedbackNote(app.getFeedbackNote())
                .referralCode(app.getReferralCode())
                .referredBy(app.getReferredBy())
                .status(app.getStatus())
                .matchScore(app.getMatchScore())
                .xaiExplanation(app.getXaiExplanation())
                .resumeAnomalyScore(app.getResumeAnomalyScore())
                .resumeAnomalyFlags(app.getResumeAnomalyFlags())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}

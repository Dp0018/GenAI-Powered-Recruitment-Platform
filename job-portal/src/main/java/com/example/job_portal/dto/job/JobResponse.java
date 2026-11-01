package com.example.job_portal.dto.job;

import com.example.job_portal.dto.auth.CompanyResponse;
import com.example.job_portal.entity.Job;
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
public class JobResponse {

    private String id;
    private String title;
    private String slug;
    private String description;
    private String requirements;
    private String location;
    private String workplaceType;
    private String jobType;
    private String experienceLevel;
    private Integer minSalary;
    private Integer maxSalary;
    private String currency;
    private String salaryPeriod;
    private Boolean hasEquity;
    private String equityRange;
    private Boolean hasSignOnBonus;
    private Integer signOnBonus;
    private Integer annualBonusPercentage;
    private String compensationNotes;
    private List<String> tags;
    private List<String> benefits;
    private Instant expiresAt;
    private boolean expired;
    private String status;
    private int applicantCount;
    private long viewsCount;
    private CompanyResponse company;
    private List<JobQuestionDto> screeningQuestions;
    private Instant createdAt;
    private Instant updatedAt;

    public static JobResponse fromEntity(Job job) {
        CompanyResponse companyResp = null;
        if (job.getCompany() != null) {
            companyResp = CompanyResponse.builder()
                    .id(job.getCompany().getId())
                    .name(job.getCompany().getName())
                    .slug(job.getCompany().getSlug())
                    .logoUrl(job.getCompany().getLogoUrl())
                    .website(job.getCompany().getWebsite())
                    .industry(job.getCompany().getIndustry())
                    .companySize(job.getCompany().getCompanySize())
                    .location(job.getCompany().getLocation())
                    .verificationStatus(job.getCompany().getVerificationStatus())
                    .benefits(job.getCompany().getBenefits() != null ? job.getCompany().getBenefits() : List.of())
                    .build();
        }

        boolean isExpired = job.getExpiresAt() != null && job.getExpiresAt().isBefore(Instant.now());

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .slug(job.getSlug())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .workplaceType(job.getWorkplaceType().name())
                .jobType(job.getJobType().name())
                .experienceLevel(job.getExperienceLevel() != null ? job.getExperienceLevel().name() : Job.ExperienceLevel.MID_LEVEL.name())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .currency(job.getCurrency() != null ? job.getCurrency() : "USD")
                .salaryPeriod(job.getSalaryPeriod() != null ? job.getSalaryPeriod() : "YEARLY")
                .hasEquity(job.getHasEquity() != null ? job.getHasEquity() : false)
                .equityRange(job.getEquityRange())
                .hasSignOnBonus(job.getHasSignOnBonus() != null ? job.getHasSignOnBonus() : false)
                .signOnBonus(job.getSignOnBonus())
                .annualBonusPercentage(job.getAnnualBonusPercentage())
                .compensationNotes(job.getCompensationNotes())
                .tags(job.getTags() != null ? job.getTags() : List.of())
                .benefits(job.getBenefits() != null ? job.getBenefits() : List.of())
                .expiresAt(job.getExpiresAt())
                .expired(isExpired)
                .status(job.getStatus().name())
                .applicantCount(job.getApplicantCount())
                .viewsCount(job.getViewsCount())
                .company(companyResp)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}

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
    private Integer minSalary;
    private Integer maxSalary;
    private String currency;
    private List<String> tags;
    private String status;
    private int applicantCount;
    private CompanyResponse company;
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
                    .build();
        }

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .slug(job.getSlug())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .workplaceType(job.getWorkplaceType().name())
                .jobType(job.getJobType().name())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .currency(job.getCurrency() != null ? job.getCurrency() : "USD")
                .tags(job.getTags())
                .status(job.getStatus().name())
                .applicantCount(job.getApplicantCount())
                .company(companyResp)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}

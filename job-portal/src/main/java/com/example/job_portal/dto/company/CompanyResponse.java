package com.example.job_portal.dto.company;

import com.example.job_portal.entity.Company;
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
public class CompanyResponse {
    private String id;
    private String name;
    private String slug;
    private String logoUrl;
    private String bannerUrl;
    private String website;
    private String industry;
    private String companySize;
    private String location;
    private String description;
    private VerificationStatus verificationStatus;
    private long activeJobsCount;
    private Instant createdAt;
    private Instant updatedAt;

    public static CompanyResponse fromEntity(Company company, long activeJobsCount) {
        if (company == null) return null;
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .slug(company.getSlug())
                .logoUrl(company.getLogoUrl())
                .bannerUrl(company.getBannerUrl())
                .website(company.getWebsite())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .location(company.getLocation())
                .description(company.getDescription())
                .verificationStatus(company.getVerificationStatus())
                .activeJobsCount(activeJobsCount)
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

    public static CompanyResponse fromEntity(Company company) {
        return fromEntity(company, 0);
    }
}

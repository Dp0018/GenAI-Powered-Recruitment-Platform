package com.example.job_portal.dto.auth;

import com.example.job_portal.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private String id;
    private String name;
    private String slug;
    private String logoUrl;
    private String website;
    private String industry;
    private String companySize;
    private String location;
    private Company.VerificationStatus verificationStatus;
}

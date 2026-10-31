package com.example.job_portal.dto.company;

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
public class UpdateCompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 150, message = "Company name must be between 2 and 150 characters")
    private String name;

    @Size(max = 250, message = "Website URL cannot exceed 250 characters")
    private String website;

    @Size(max = 100, message = "Industry cannot exceed 100 characters")
    private String industry;

    @Size(max = 50, message = "Company size cannot exceed 50 characters")
    private String companySize;

    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String location;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    @Size(max = 500, message = "Logo URL cannot exceed 500 characters")
    private String logoUrl;

    @Size(max = 500, message = "Banner URL cannot exceed 500 characters")
    private String bannerUrl;
}

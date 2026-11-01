package com.example.job_portal.dto.offer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobOfferRequest {

    @NotBlank(message = "Application ID is required")
    private String applicationId;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    @NotNull(message = "Base salary is required")
    @Positive(message = "Base salary must be positive")
    private Integer baseSalary;

    private String currency;
    private String payPeriod;
    private String equityDetails;
    private Integer signOnBonus;
    private String annualBonusDetails;
    private LocalDate startDate;
    private Integer expirationDays;
    private String letterBody;
    private String benefitsSummary;
}

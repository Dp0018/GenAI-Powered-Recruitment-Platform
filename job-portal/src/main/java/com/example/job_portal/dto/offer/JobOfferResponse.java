package com.example.job_portal.dto.offer;

import com.example.job_portal.entity.JobOffer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobOfferResponse {

    private String id;
    private String applicationId;
    private String jobId;
    private String companyId;
    private String companyName;
    private String companyLogo;
    private String candidateId;
    private String candidateName;
    private String candidateEmail;
    private String jobTitle;
    private Integer baseSalary;
    private String currency;
    private String payPeriod;
    private String equityDetails;
    private Integer signOnBonus;
    private String annualBonusDetails;
    private LocalDate startDate;
    private Instant expiresAt;
    private boolean expired;
    private String status;
    private String letterBody;
    private String benefitsSummary;
    private String signatureToken;
    private Instant signedAt;
    private String signerName;
    private Instant declinedAt;
    private String declinedReason;
    private Instant createdAt;
    private Instant updatedAt;

    public static JobOfferResponse fromEntity(JobOffer offer) {
        boolean isExpired = offer.getExpiresAt() != null && offer.getExpiresAt().isBefore(Instant.now());

        return JobOfferResponse.builder()
                .id(offer.getId())
                .applicationId(offer.getApplication() != null ? offer.getApplication().getId() : null)
                .jobId(offer.getApplication() != null && offer.getApplication().getJob() != null ? offer.getApplication().getJob().getId() : null)
                .companyId(offer.getCompany() != null ? offer.getCompany().getId() : null)
                .companyName(offer.getCompany() != null ? offer.getCompany().getName() : null)
                .companyLogo(offer.getCompany() != null ? offer.getCompany().getLogoUrl() : null)
                .candidateId(offer.getCandidate() != null ? offer.getCandidate().getId() : null)
                .candidateName(offer.getCandidate() != null ? offer.getCandidate().getName() : null)
                .candidateEmail(offer.getCandidate() != null ? offer.getCandidate().getEmail() : null)
                .jobTitle(offer.getJobTitle())
                .baseSalary(offer.getBaseSalary())
                .currency(offer.getCurrency())
                .payPeriod(offer.getPayPeriod())
                .equityDetails(offer.getEquityDetails())
                .signOnBonus(offer.getSignOnBonus())
                .annualBonusDetails(offer.getAnnualBonusDetails())
                .startDate(offer.getStartDate())
                .expiresAt(offer.getExpiresAt())
                .expired(isExpired)
                .status(offer.getStatus().name())
                .letterBody(offer.getLetterBody())
                .benefitsSummary(offer.getBenefitsSummary())
                .signatureToken(offer.getSignatureToken())
                .signedAt(offer.getSignedAt())
                .signerName(offer.getSignerName())
                .declinedAt(offer.getDeclinedAt())
                .declinedReason(offer.getDeclinedReason())
                .createdAt(offer.getCreatedAt())
                .updatedAt(offer.getUpdatedAt())
                .build();
    }
}

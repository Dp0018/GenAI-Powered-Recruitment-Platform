package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "job_offers", indexes = {
        @Index(name = "idx_offer_application_id", columnList = "application_id"),
        @Index(name = "idx_offer_signature_token", columnList = "signature_token", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @Column(name = "job_title", nullable = false, length = 200)
    private String jobTitle;

    @Column(name = "base_salary", nullable = false)
    private Integer baseSalary;

    @Column(length = 10, nullable = false)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "pay_period", length = 20)
    @Builder.Default
    private String payPeriod = "ANNUAL"; // ANNUAL, HOURLY, MONTHLY

    @Column(name = "equity_details", length = 255)
    private String equityDetails;

    @Column(name = "sign_on_bonus")
    private Integer signOnBonus;

    @Column(name = "annual_bonus_details", length = 255)
    private String annualBonusDetails;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private OfferStatus status = OfferStatus.DRAFT;

    @Column(name = "letter_body", columnDefinition = "TEXT")
    private String letterBody;

    @Column(name = "benefits_summary", columnDefinition = "TEXT")
    private String benefitsSummary;

    // E-signature fields
    @Column(name = "signature_token", length = 64, unique = true)
    private String signatureToken;

    @Column(name = "signed_at")
    private Instant signedAt;

    @Column(name = "signer_name", length = 150)
    private String signerName;

    @Column(name = "signer_ip", length = 60)
    private String signerIp;

    @Column(name = "signature_consent")
    private Boolean signatureConsent;

    @Column(name = "declined_at")
    private Instant declinedAt;

    @Column(name = "declined_reason", columnDefinition = "TEXT")
    private String declinedReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum OfferStatus {
        DRAFT,
        PENDING_APPROVAL,
        SENT,
        ACCEPTED,
        DECLINED,
        EXPIRED
    }
}

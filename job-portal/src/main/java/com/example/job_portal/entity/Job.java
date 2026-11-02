package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_job_slug", columnList = "slug"),
        @Index(name = "idx_job_company", columnList = "company_id"),
        @Index(name = "idx_job_status", columnList = "status"),
        @Index(name = "idx_job_location", columnList = "location")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 250)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(nullable = false, length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "workplace_type", nullable = false, length = 30)
    @Builder.Default
    private WorkplaceType workplaceType = WorkplaceType.REMOTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false, length = 30)
    @Builder.Default
    private JobType jobType = JobType.FULL_TIME;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 30)
    @Builder.Default
    private ExperienceLevel experienceLevel = ExperienceLevel.MID_LEVEL;

    @Column(name = "min_salary")
    private Integer minSalary;

    @Column(name = "max_salary")
    private Integer maxSalary;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "salary_period", length = 20)
    @Builder.Default
    private String salaryPeriod = "YEARLY";

    @Column(name = "has_equity")
    @Builder.Default
    private Boolean hasEquity = false;

    @Column(name = "equity_range", length = 100)
    private String equityRange;

    @Column(name = "has_sign_on_bonus")
    @Builder.Default
    private Boolean hasSignOnBonus = false;

    @Column(name = "sign_on_bonus")
    private Integer signOnBonus;

    @Column(name = "annual_bonus_percentage")
    private Integer annualBonusPercentage;

    @Column(name = "compensation_notes", columnDefinition = "TEXT")
    private String compensationNotes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_tags", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_benefits", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "benefit")
    @Builder.Default
    private List<String> benefits = new ArrayList<>();

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private JobStatus status = JobStatus.PUBLISHED;

    @Column(name = "applicant_count")
    @Builder.Default
    private Integer applicantCount = 0;

    @Column(name = "views_count")
    @Builder.Default
    private Long viewsCount = 0L;

    @Column(name = "fraud_risk_score")
    @Builder.Default
    private Integer fraudRiskScore = 0;

    @Column(name = "fraud_risk_level", length = 30)
    @Builder.Default
    private String fraudRiskLevel = "LOW";

    @Column(name = "fraud_reasons", columnDefinition = "TEXT")
    private String fraudReasons;

    @Column(name = "is_quarantined")
    @Builder.Default
    private Boolean isQuarantined = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public enum WorkplaceType {
        REMOTE,
        HYBRID,
        ONSITE
    }

    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        INTERNSHIP
    }

    public enum JobStatus {
        DRAFT,
        PUBLISHED,
        CLOSED
    }

    public enum ExperienceLevel {
        ENTRY_LEVEL,
        MID_LEVEL,
        SENIOR,
        LEAD,
        EXECUTIVE
    }

    public long getViewsCount() {
        return viewsCount == null ? 0L : viewsCount;
    }

    public int getApplicantCount() {
        return applicantCount == null ? 0 : applicantCount;
    }

    public int getFraudRiskScore() {
        return fraudRiskScore == null ? 0 : fraudRiskScore;
    }

    public boolean isQuarantined() {
        return Boolean.TRUE.equals(isQuarantined);
    }
}


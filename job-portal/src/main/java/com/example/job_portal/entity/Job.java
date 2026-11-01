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
    private int applicantCount = 0;

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
}

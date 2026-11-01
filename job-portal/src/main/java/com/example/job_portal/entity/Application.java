package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "applications",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_job_candidate_application", columnNames = {"job_id", "candidate_id"})
        },
        indexes = {
                @Index(name = "idx_application_candidate", columnList = "candidate_id"),
                @Index(name = "idx_application_job_status", columnList = "job_id, status")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(length = 500)
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Column(length = 30)
    private String phone;

    @Column(name = "feedback_note", columnDefinition = "TEXT")
    private String feedbackNote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum ApplicationStatus {
        APPLIED,
        REVIEWING,
        SHORTLISTED,
        INTERVIEWING,
        OFFERED,
        REJECTED,
        WITHDRAWN
    }
}

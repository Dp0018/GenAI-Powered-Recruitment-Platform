package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "job_alerts", indexes = {
        @Index(name = "idx_job_alerts_candidate_id", columnList = "candidate_id"),
        @Index(name = "idx_job_alerts_active", columnList = "active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobAlert {

    public enum AlertFrequency {
        DAILY,
        WEEKLY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(nullable = false, length = 120)
    private String keyword;

    @Column(length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private AlertFrequency frequency = AlertFrequency.DAILY;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "last_notified_at")
    private Instant lastNotifiedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}

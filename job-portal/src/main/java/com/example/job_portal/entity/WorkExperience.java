package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "candidate_work_experiences", indexes = {
        @Index(name = "idx_work_exp_profile_id", columnList = "profile_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private CandidateProfile profile;

    @Column(nullable = false, length = 140)
    private String company;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(length = 100)
    private String location;

    @Column(name = "start_date", length = 40)
    private String startDate;

    @Column(name = "end_date", length = 40)
    private String endDate;

    @Builder.Default
    @Column(name = "currently_working")
    private boolean currentlyWorking = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}

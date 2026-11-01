package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "candidate_education_history", indexes = {
        @Index(name = "idx_edu_hist_profile_id", columnList = "profile_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private CandidateProfile profile;

    @Column(nullable = false, length = 180)
    private String institution;

    @Column(nullable = false, length = 140)
    private String degree;

    @Column(name = "field_of_study", length = 140)
    private String fieldOfStudy;

    @Column(name = "start_date", length = 40)
    private String startDate;

    @Column(name = "end_date", length = 40)
    private String endDate;

    @Column(name = "grade_or_gpa", length = 30)
    private String gradeOrGpa;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}

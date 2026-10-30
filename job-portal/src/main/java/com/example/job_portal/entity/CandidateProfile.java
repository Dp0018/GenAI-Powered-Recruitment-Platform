package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidate_profiles", indexes = {
        @Index(name = "idx_candidate_profile_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 180)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 120)
    private String location;

    @Column(name = "website_url", length = 300)
    private String websiteUrl;

    @Column(name = "github_url", length = 300)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 300)
    private String linkedinUrl;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "resume_file_name", length = 200)
    private String resumeFileName;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "candidate_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill", length = 60)
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "current_position", length = 120)
    private String currentRole;

    @Column(name = "current_company", length = 120)
    private String currentCompany;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}

package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "candidate_subscriptions", indexes = {
        @Index(name = "idx_cand_sub_user", columnList = "user_id"),
        @Index(name = "idx_cand_sub_stripe_cust", columnList = "stripe_customer_id"),
        @Index(name = "idx_cand_sub_stripe_sub", columnList = "stripe_subscription_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false, length = 30)
    @Builder.Default
    private CandidatePlan planType = CandidatePlan.FREE;

    @Column(name = "stripe_customer_id", length = 120)
    private String stripeCustomerId;

    @Column(name = "stripe_subscription_id", length = 120)
    private String stripeSubscriptionId;

    @Column(name = "stripe_price_id", length = 120)
    private String stripePriceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Column(name = "current_period_start")
    private Instant currentPeriodStart;

    @Column(name = "current_period_end")
    private Instant currentPeriodEnd;

    @Column(name = "cancel_at_period_end", nullable = false)
    @Builder.Default
    private boolean cancelAtPeriodEnd = false;

    @Column(name = "ai_resume_optimizer_enabled", nullable = false)
    @Builder.Default
    private boolean aiResumeOptimizerEnabled = false;

    @Column(name = "spotlight_badge_enabled", nullable = false)
    @Builder.Default
    private boolean spotlightBadgeEnabled = false;

    @Column(name = "max_resumes", nullable = false)
    @Builder.Default
    private int maxResumes = 2;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}

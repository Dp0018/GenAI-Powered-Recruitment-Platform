package com.example.job_portal.dto.billing;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionStatusResponse {
    private String planType; // FREE, GROWTH, ENTERPRISE, PRO
    private String status;   // ACTIVE, PAST_DUE, CANCELED
    private boolean isPaid;
    private int jobPostingLimit;
    private int currentActiveJobs;
    private boolean aiFeaturesEnabled;
    private boolean aiResumeOptimizerEnabled;
    private boolean spotlightBadgeEnabled;
    private int maxResumes;
    private Instant currentPeriodEnd;
    private boolean cancelAtPeriodEnd;
    private String customerId;
}

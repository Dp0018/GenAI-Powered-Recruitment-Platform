package com.example.job_portal.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    // User metrics
    private long totalUsers;
    private long totalCandidates;
    private long totalEmployers;
    private long bannedUsers;

    // Company & KYC metrics
    private long totalCompanies;
    private long pendingCompanies;
    private long verifiedCompanies;
    private long rejectedCompanies;

    // Jobs & applications
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
}

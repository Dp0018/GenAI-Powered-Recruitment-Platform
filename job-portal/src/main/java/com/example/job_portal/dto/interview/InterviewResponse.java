package com.example.job_portal.dto.interview;

import com.example.job_portal.entity.Interview.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private String id;
    private String applicationId;
    private String jobId;
    private String jobTitle;
    private String companyId;
    private String companyName;
    private String companyLogo;
    private String candidateId;
    private String candidateName;
    private String candidateEmail;
    private String title;
    private Instant scheduledAt;
    private Integer durationMinutes;
    private String meetingLink;
    private String notes;
    private java.util.List<Instant> proposedSlots;
    private InterviewStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}

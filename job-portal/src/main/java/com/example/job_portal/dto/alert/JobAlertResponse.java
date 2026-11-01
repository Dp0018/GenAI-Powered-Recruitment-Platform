package com.example.job_portal.dto.alert;

import com.example.job_portal.entity.JobAlert;
import com.example.job_portal.entity.JobAlert.AlertFrequency;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobAlertResponse {

    private String id;
    private String candidateId;
    private String candidateEmail;
    private String keyword;
    private String location;
    private AlertFrequency frequency;
    private boolean active;
    private Instant lastNotifiedAt;
    private Instant createdAt;

    public static JobAlertResponse from(JobAlert alert) {
        if (alert == null) return null;
        return JobAlertResponse.builder()
                .id(alert.getId())
                .candidateId(alert.getCandidate().getId())
                .candidateEmail(alert.getCandidate().getEmail())
                .keyword(alert.getKeyword())
                .location(alert.getLocation())
                .frequency(alert.getFrequency())
                .active(alert.isActive())
                .lastNotifiedAt(alert.getLastNotifiedAt())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}

package com.example.job_portal.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningNoteResponse {

    private String id;
    private String applicationId;
    private String authorId;
    private String authorName;
    private String authorEmail;
    private Integer rating;
    private String note;
    private Instant createdAt;
}

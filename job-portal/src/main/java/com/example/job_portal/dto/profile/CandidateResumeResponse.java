package com.example.job_portal.dto.profile;

import com.example.job_portal.entity.CandidateResume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResumeResponse {

    private String id;
    private String candidateId;
    private String title;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private boolean isDefault;
    private Instant createdAt;
    private Instant updatedAt;

    public static CandidateResumeResponse fromEntity(CandidateResume resume) {
        if (resume == null) return null;

        return CandidateResumeResponse.builder()
                .id(resume.getId())
                .candidateId(resume.getCandidate() != null ? resume.getCandidate().getId() : null)
                .title(resume.getTitle())
                .fileName(resume.getFileName())
                .fileUrl(resume.getFileUrl())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .isDefault(resume.isDefault())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }
}

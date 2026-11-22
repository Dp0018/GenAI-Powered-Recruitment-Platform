package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "resume_document_chunks", indexes = {
        @Index(name = "idx_resume_chunks_candidate", columnList = "candidate_id"),
        @Index(name = "idx_resume_chunks_resume", columnList = "resume_id"),
        @Index(name = "idx_resume_chunks_section", columnList = "section_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDocumentChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private CandidateResume candidateResume;

    @Column(name = "section_type", nullable = false, length = 50)
    private String sectionType; // 'EXPERIENCE', 'SKILLS', 'EDUCATION', 'PROJECTS', 'SUMMARY'

    @Column(name = "chunk_title", length = 200)
    private String chunkTitle;

    @Column(name = "chunk_text", nullable = false, columnDefinition = "TEXT")
    private String chunkText;

    @Column(name = "embedding_json", nullable = false, columnDefinition = "TEXT")
    private String embeddingJson; // Serialized List<Float> of 768 dimensions

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}


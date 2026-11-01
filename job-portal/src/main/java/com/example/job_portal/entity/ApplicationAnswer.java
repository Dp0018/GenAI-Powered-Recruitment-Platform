package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "application_screening_answers", indexes = {
        @Index(name = "idx_answer_application", columnList = "application_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "question_id")
    private String questionId;

    @Column(name = "question_text", nullable = false, length = 500)
    private String questionText;

    @Column(name = "answer_text", columnDefinition = "TEXT", nullable = false)
    private String answerText;
}

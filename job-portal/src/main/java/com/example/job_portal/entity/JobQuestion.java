package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_screening_questions", indexes = {
        @Index(name = "idx_job_question_job", columnList = "job_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "question_text", nullable = false, length = 500)
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false, length = 30)
    @Builder.Default
    private QuestionType questionType = QuestionType.TEXT;

    @Column(nullable = false)
    @Builder.Default
    private boolean required = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    @Builder.Default
    private List<String> options = new ArrayList<>();

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;

    public enum QuestionType {
        TEXT,
        BOOLEAN,
        CHOICE
    }
}

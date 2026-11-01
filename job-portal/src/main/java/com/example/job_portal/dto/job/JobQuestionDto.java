package com.example.job_portal.dto.job;

import com.example.job_portal.entity.JobQuestion.QuestionType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobQuestionDto {

    private String id;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @Builder.Default
    private QuestionType questionType = QuestionType.TEXT;

    @Builder.Default
    private boolean required = true;

    @Builder.Default
    private List<String> options = new ArrayList<>();

    @Builder.Default
    private Integer orderIndex = 0;
}

package com.example.job_portal.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningAnswerDto {

    private String questionId;
    private String questionText;
    private String answerText;
}

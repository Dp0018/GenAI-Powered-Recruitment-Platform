package com.example.job_portal.dto.rag;

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
public class ResumeChatRequest {

    @NotBlank(message = "Question cannot be blank")
    private String question;

    @Builder.Default
    private List<ChatMessageDto> history = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessageDto {
        private String role; // "user" or "assistant"
        private String content;
    }
}


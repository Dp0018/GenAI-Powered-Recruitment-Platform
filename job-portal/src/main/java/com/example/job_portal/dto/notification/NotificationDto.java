package com.example.job_portal.dto.notification;

import com.example.job_portal.entity.Notification;
import com.example.job_portal.entity.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private String id;
    private String title;
    private String message;
    private NotificationType type;
    private String linkUrl;
    private boolean read;
    private Instant createdAt;

    public static NotificationDto from(Notification n) {
        if (n == null) return null;
        return NotificationDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .linkUrl(n.getLinkUrl())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}

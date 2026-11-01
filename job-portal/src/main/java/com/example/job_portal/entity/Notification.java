package com.example.job_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "in_app_notifications", indexes = {
        @Index(name = "idx_notifications_recipient_id", columnList = "recipient_id"),
        @Index(name = "idx_notifications_read", columnList = "is_read")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    public enum NotificationType {
        APPLICATION_STATUS,
        INTERVIEW_INVITE,
        INTERVIEW_CANCELLED,
        NEW_APPLICANT,
        COMPANY_VERIFIED,
        SYSTEM
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private NotificationType type = NotificationType.SYSTEM;

    @Column(name = "link_url", length = 300)
    private String linkUrl;

    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}

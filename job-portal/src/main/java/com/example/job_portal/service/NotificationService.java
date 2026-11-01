package com.example.job_portal.service;

import com.example.job_portal.dto.notification.NotificationDto;
import com.example.job_portal.entity.Notification.NotificationType;
import com.example.job_portal.entity.User;
import com.example.job_portal.security.UserPrincipal;

import java.util.List;

public interface NotificationService {

    void sendNotification(User recipient, String title, String message, NotificationType type, String linkUrl);

    List<NotificationDto> getMyNotifications(UserPrincipal currentUser);

    long getUnreadCount(UserPrincipal currentUser);

    void markAsRead(UserPrincipal currentUser, String notificationId);

    void markAllAsRead(UserPrincipal currentUser);
}

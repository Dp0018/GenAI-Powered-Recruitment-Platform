package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.notification.NotificationDto;
import com.example.job_portal.entity.Notification;
import com.example.job_portal.entity.Notification.NotificationType;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.NotificationRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void sendNotification(User recipient, String title, String message, NotificationType type, String linkUrl) {
        if (recipient == null) return;

        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .type(type != null ? type : NotificationType.SYSTEM)
                .linkUrl(linkUrl)
                .read(false)
                .build();

        notificationRepository.save(notification);
        log.info("Sent in-app notification to user='{}' title='{}'", recipient.getEmail(), title);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getMyNotifications(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        return notificationRepository.findTop30ByRecipientOrderByCreatedAtDesc(user).stream()
                .map(NotificationDto::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    @Override
    @Transactional
    public void markAsRead(UserPrincipal currentUser, String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You cannot mark another user's notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        notificationRepository.markAllAsReadByRecipient(user);
    }
}

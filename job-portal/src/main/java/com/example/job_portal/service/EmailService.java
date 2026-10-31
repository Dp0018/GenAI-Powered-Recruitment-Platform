package com.example.job_portal.service;

import com.example.job_portal.entity.Application;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otpCode, int expirationMinutes);

    void sendApplicationReceivedEmail(String candidateEmail, String candidateName, String jobTitle, String companyName);

    void sendApplicationStatusUpdateEmail(String candidateEmail, String candidateName, String jobTitle,
            String companyName, Application.ApplicationStatus newStatus, String customNote);

    void sendCompanyVerificationEmail(String recipientEmail, String recipientName, String companyName,
            boolean verified, String notes);
}

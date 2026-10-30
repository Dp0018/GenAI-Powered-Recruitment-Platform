package com.example.job_portal.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otpCode, int expirationMinutes);
}

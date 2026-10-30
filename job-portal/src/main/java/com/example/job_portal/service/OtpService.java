package com.example.job_portal.service;

public interface OtpService {

    void sendEmailVerificationOtp(String email);

    void verifyEmailOtp(String email, String otp);

    void resendOtp(String email);
}

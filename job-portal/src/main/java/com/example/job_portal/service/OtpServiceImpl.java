package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.entity.User;
import com.example.job_portal.entity.Verification;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final EmailService emailService;

    @Value("${app.otp.expiration-minutes:10}")
    private int expirationMinutes;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public void sendEmailVerificationOtp(String email) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", normalizedEmail));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        String otpCode = generateSixDigitOtp();
        Instant expiresAt = Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES);

        Verification verification = verificationRepository.findByIdentifier(normalizedEmail)
                .map(existing -> {
                    existing.setValue(otpCode);
                    existing.setExpiresAt(expiresAt);
                    return existing;
                })
                .orElseGet(() -> Verification.builder()
                        .identifier(normalizedEmail)
                        .value(otpCode)
                        .expiresAt(expiresAt)
                        .build());

        verificationRepository.save(verification);

        emailService.sendOtpEmail(normalizedEmail, otpCode, expirationMinutes);
        log.info("Email verification OTP dispatched for: {}", normalizedEmail);
    }

    @Override
    @Transactional
    public void verifyEmailOtp(String email, String otp) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        String trimmedOtp = otp.trim();

        Verification verification = verificationRepository.findByIdentifierAndValue(normalizedEmail, trimmedOtp)
                .orElseThrow(() -> new BadRequestException("Invalid verification code"));

        if (verification.isExpired()) {
            verificationRepository.delete(verification);
            throw new BadRequestException("Verification code has expired. Please request a new one.");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", normalizedEmail));

        user.setEmailVerified(true);
        userRepository.save(user);

        // Delete used OTP
        verificationRepository.delete(verification);

        log.info("Email verified successfully for user: {}", normalizedEmail);
    }

    @Override
    @Transactional
    public void resendOtp(String email) {
        sendEmailVerificationOtp(email);
    }

    private String generateSixDigitOtp() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }
}

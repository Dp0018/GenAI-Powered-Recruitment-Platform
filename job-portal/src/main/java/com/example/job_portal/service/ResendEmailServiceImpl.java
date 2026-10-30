package com.example.job_portal.service;

import com.example.job_portal.common.exception.InvalidOperationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class ResendEmailServiceImpl implements EmailService {

    private final RestClient restClient;

    @Value("${app.resend.api-key:}")
    private String resendApiKey;

    @Value("${app.resend.from-email:onboarding@resend.dev}")
    private String fromEmail;

    public ResendEmailServiceImpl() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public void sendOtpEmail(String toEmail, String otpCode, int expirationMinutes) {
        if (!StringUtils.hasText(resendApiKey)) {
            log.error("Resend API key is missing. Set 'app.resend.api-key' in application-local.properties");
            throw new InvalidOperationException(
                    "Email verification service is temporarily unavailable: Resend API key is not configured."
            );
        }

        String htmlContent = buildOtpHtmlTemplate(otpCode, expirationMinutes);

        Map<String, Object> payload = new HashMap<>();
        payload.put("from", fromEmail);
        payload.put("to", Collections.singletonList(toEmail));
        payload.put("subject", "Verify Your JobPortal Account - " + otpCode);
        payload.put("html", htmlContent);

        try {
            String response = restClient.post()
                    .uri("/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendApiKey.trim())
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            log.info("Verification OTP email sent to {} via Resend. Response: {}", toEmail, response);
        } catch (Exception ex) {
            log.error("Failed to send email via Resend API to {}: {}", toEmail, ex.getMessage(), ex);
            throw new InvalidOperationException("Failed to deliver OTP email: " + ex.getMessage());
        }
    }

    private String buildOtpHtmlTemplate(String otpCode, int expirationMinutes) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090A0F; color: #FFFFFF; margin: 0; padding: 40px 20px; }
                    .container { max-width: 520px; margin: 0 auto; background: #12141F; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 40px; }
                    .brand { font-size: 20px; font-weight: 700; color: #6366F1; letter-spacing: -0.5px; margin-bottom: 24px; text-transform: uppercase; }
                    .title { font-size: 24px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px; }
                    .description { font-size: 15px; color: #94A3B8; line-height: 1.6; margin-bottom: 32px; }
                    .otp-box { background: #1E2235; border: 1px solid #312E81; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 32px; }
                    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #818CF8; font-family: 'Courier New', monospace; }
                    .footer { font-size: 13px; color: #64748B; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 24px; margin-top: 32px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="brand">JobPortal</div>
                    <div class="title">Verify Your Email Address</div>
                    <div class="description">
                      Please use the following 6-digit verification code to complete your registration. This code will expire in %d minutes.
                    </div>
                    <div class="otp-box">
                      <div class="otp-code">%s</div>
                    </div>
                    <div class="description" style="font-size: 13px; color: #64748B; margin-bottom: 0;">
                      If you did not request this email, you can safely ignore it.
                    </div>
                    <div class="footer">
                      &copy; 2026 JobPortal Platform Inc. Multi-Vendor Hiring Engine.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(expirationMinutes, otpCode);
    }
}

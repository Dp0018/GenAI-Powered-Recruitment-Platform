package com.example.job_portal.service;

import com.example.job_portal.common.exception.InvalidOperationException;
import com.example.job_portal.entity.Application;
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
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class ResendEmailServiceImpl implements EmailService {

    private final RestClient restClient;

    @Value("${app.resend.api-key:}")
    private String resendApiKey;

    @Value("${app.resend.from-email:onboarding@resend.dev}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

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
        executeEmailSend(toEmail, "Verify Your JobPortal Account - " + otpCode, htmlContent, true);
    }

    @Override
    public void sendApplicationReceivedEmail(String candidateEmail, String candidateName, String jobTitle, String companyName) {
        CompletableFuture.runAsync(() -> {
            try {
                if (!StringUtils.hasText(resendApiKey)) {
                    log.info("[Email Skipped] Resend API key not configured for application received notification to {}", candidateEmail);
                    return;
                }

                String subject = "Application Received: " + jobTitle + " at " + companyName;
                String htmlContent = buildApplicationReceivedTemplate(candidateName, jobTitle, companyName);
                executeEmailSend(candidateEmail, subject, htmlContent, false);
            } catch (Exception e) {
                log.warn("Non-fatal: Failed to send application received email to {}: {}", candidateEmail, e.getMessage());
            }
        });
    }

    @Override
    public void sendApplicationStatusUpdateEmail(
            String candidateEmail,
            String candidateName,
            String jobTitle,
            String companyName,
            Application.ApplicationStatus newStatus,
            String customNote
    ) {
        CompletableFuture.runAsync(() -> {
            try {
                if (!StringUtils.hasText(resendApiKey)) {
                    log.info("[Email Skipped] Resend API key not configured for status update notification to {}", candidateEmail);
                    return;
                }

                String subject = getStatusSubject(newStatus, jobTitle, companyName);
                String htmlContent = buildStatusUpdateTemplate(candidateName, jobTitle, companyName, newStatus, customNote);
                executeEmailSend(candidateEmail, subject, htmlContent, false);
            } catch (Exception e) {
                log.warn("Non-fatal: Failed to send status update email to {}: {}", candidateEmail, e.getMessage());
            }
        });
    }

    private void executeEmailSend(String toEmail, String subject, String htmlContent, boolean throwOnError) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("from", fromEmail);
        payload.put("to", Collections.singletonList(toEmail));
        payload.put("subject", subject);
        payload.put("html", htmlContent);

        try {
            String response = restClient.post()
                    .uri("/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendApiKey.trim())
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            log.info("Email delivered via Resend to '{}' [Subject: '{}']. Response: {}", toEmail, subject, response);
        } catch (Exception ex) {
            log.error("Failed to deliver email via Resend to {}: {}", toEmail, ex.getMessage());
            if (ex.getMessage() != null && ex.getMessage().contains("domain is not verified")) {
                log.warn(">>> [RESEND TRIAL NOTICE] Resend trial accounts can only send to verified addresses or sandbox test emails. Email logged above. <<<");
                return;
            }
            if (throwOnError) {
                throw new InvalidOperationException("Failed to send email: " + ex.getMessage());
            }
        }
    }

    private String getStatusSubject(Application.ApplicationStatus status, String jobTitle, String companyName) {
        return switch (status) {
            case SHORTLISTED -> "Shortlisted: Your application for " + jobTitle + " at " + companyName;
            case INTERVIEWING -> "Interview Invitation: " + jobTitle + " at " + companyName;
            case OFFERED -> "Offer Extended: " + jobTitle + " at " + companyName + " 🎉";
            case REJECTED -> "Update regarding your application for " + jobTitle + " at " + companyName;
            case REVIEWING -> "Under Review: Your application for " + jobTitle + " at " + companyName;
            default -> "Application Status Update: " + jobTitle + " at " + companyName;
        };
    }

    private String buildOtpHtmlTemplate(String otpCode, int expirationMinutes) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090A0F; color: #FFFFFF; margin: 0; padding: 40px 20px; }
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
                      &copy; 2026 JobPortal Platform Inc.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(expirationMinutes, otpCode);
    }

    private String buildApplicationReceivedTemplate(String candidateName, String jobTitle, String companyName) {
        String dashboardUrl = frontendUrl + "/dashboard/candidate";
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B0F19; color: #FFFFFF; margin: 0; padding: 40px 20px; }
                    .container { max-width: 560px; margin: 0 auto; background: #111827; border: 1px solid #1F2937; border-radius: 16px; padding: 36px; }
                    .brand { font-size: 18px; font-weight: 700; color: #6366F1; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .title { font-size: 22px; font-weight: 700; color: #F9FAFB; margin-bottom: 12px; }
                    .text { font-size: 14px; color: #9CA3AF; line-height: 1.6; margin-bottom: 24px; }
                    .card { background: #1F2937; border-radius: 10px; padding: 18px 22px; margin-bottom: 28px; border-left: 4px solid #6366F1; }
                    .job-title { font-size: 16px; font-weight: 600; color: #FFFFFF; }
                    .company-name { font-size: 13px; color: #9CA3AF; margin-top: 4px; }
                    .btn { display: inline-block; background-color: #4F46E5; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; }
                    .footer { font-size: 12px; color: #6B7280; border-top: 1px solid #1F2937; padding-top: 20px; margin-top: 32px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="brand">JobPortal</div>
                    <div class="title">Application Submitted Successfully</div>
                    <div class="text">
                      Hello %s,<br><br>
                      Your application has been delivered directly to the corporate recruitment team. Here are the details of your submission:
                    </div>
                    <div class="card">
                      <div class="job-title">%s</div>
                      <div class="company-name">%s • Status: <strong>Submitted (APPLIED)</strong></div>
                    </div>
                    <div class="text">
                      The hiring team will review your credentials and reach out with next steps. You can check the real-time status of all your applications in your dashboard:
                    </div>
                    <div>
                      <a href="%s" class="btn">View Candidate Dashboard</a>
                    </div>
                    <div class="footer">
                      &copy; 2026 JobPortal Platform Inc. All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(candidateName, jobTitle, companyName, dashboardUrl);
    }

    private String buildStatusUpdateTemplate(
            String candidateName,
            String jobTitle,
            String companyName,
            Application.ApplicationStatus status,
            String customNote
    ) {
        String dashboardUrl = frontendUrl + "/dashboard/candidate";

        String statusBadgeColor = switch (status) {
            case SHORTLISTED -> "#8B5CF6";
            case INTERVIEWING -> "#F59E0B";
            case OFFERED -> "#10B981";
            case REJECTED -> "#6B7280";
            default -> "#6366F1";
        };

        String statusExplanation = switch (status) {
            case SHORTLISTED -> "Great news! Your qualifications have caught the attention of the hiring team and you have been shortlisted for this position.";
            case INTERVIEWING -> "The team at " + companyName + " would like to move forward with interviewing you. Please keep an eye on your email and phone for meeting details.";
            case OFFERED -> "Congratulations! " + companyName + " has extended an offer of employment. Access your dashboard for offer details.";
            case REJECTED -> "Thank you for taking the time to share your background with " + companyName + ". After careful consideration, they have decided to move forward with other candidates whose experience more closely matches their current requirements.";
            case REVIEWING -> "Your application is currently being evaluated by the hiring managers.";
            default -> "There has been an update regarding your application stage.";
        };

        String noteSection = StringUtils.hasText(customNote)
                ? "<div style=\"background:#1E293B; border-left:3px solid #94A3B8; padding:12px 16px; margin: 20px 0; border-radius:6px; font-size:13px; color:#E2E8F0;\"><strong>Note from Hiring Manager:</strong><br>" + customNote + "</div>"
                : "";

        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B0F19; color: #FFFFFF; margin: 0; padding: 40px 20px; }
                    .container { max-width: 560px; margin: 0 auto; background: #111827; border: 1px solid #1F2937; border-radius: 16px; padding: 36px; }
                    .brand { font-size: 18px; font-weight: 700; color: #6366F1; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .title { font-size: 22px; font-weight: 700; color: #F9FAFB; margin-bottom: 12px; }
                    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; font-family: monospace; letter-spacing: 0.5px; background: %s; color: #FFFFFF; margin-bottom: 16px; }
                    .text { font-size: 14px; color: #9CA3AF; line-height: 1.6; margin-bottom: 24px; }
                    .card { background: #1F2937; border-radius: 10px; padding: 18px 22px; margin-bottom: 24px; }
                    .job-title { font-size: 16px; font-weight: 600; color: #FFFFFF; }
                    .company-name { font-size: 13px; color: #9CA3AF; margin-top: 4px; }
                    .btn { display: inline-block; background-color: #4F46E5; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; }
                    .footer { font-size: 12px; color: #6B7280; border-top: 1px solid #1F2937; padding-top: 20px; margin-top: 32px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="brand">JobPortal</div>
                    <div class="badge">%s</div>
                    <div class="title">Application Stage Updated</div>
                    <div class="text">
                      Hello %s,<br><br>
                      %s
                    </div>
                    <div class="card">
                      <div class="job-title">%s</div>
                      <div class="company-name">%s</div>
                    </div>
                    %s
                    <div>
                      <a href="%s" class="btn">View Application Details</a>
                    </div>
                    <div class="footer">
                      &copy; 2026 JobPortal Platform Inc. All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(statusBadgeColor, status.name(), candidateName, statusExplanation, jobTitle, companyName, noteSection, dashboardUrl);
    }

    @Override
    public void sendCompanyVerificationEmail(String recipientEmail, String recipientName, String companyName,
            boolean verified, String notes) {
        CompletableFuture.runAsync(() -> {
            try {
                if (!StringUtils.hasText(resendApiKey)) {
                    log.info("[Email Skipped] Resend API key not configured for company verification notification to {}", recipientEmail);
                    return;
                }

                String statusTitle = verified ? "Company Profile Verified" : "Company Verification Rejected";
                String badgeColor = verified ? "#059669" : "#DC2626";
                String badgeText = verified ? "KYC VERIFIED" : "VERIFICATION REJECTED";
                String bodyText = verified
                        ? "Congratulations! Your employer profile and company entity have been officially verified by platform administrators. You now have full authorization to publish active job requisitions and source talent on JobPortal."
                        : "Your company verification request has been rejected by platform administrators.";

                String noteHtml = StringUtils.hasText(notes)
                        ? "<div style=\"background: #1F2937; border-left: 3px solid #6366F1; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #D1D5DB;\"><strong>Administrator Note:</strong> " + notes + "</div>"
                        : "";

                String dashboardUrl = frontendUrl + "/dashboard/employer";

                String htmlContent = """
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="utf-8">
                          <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B0F19; color: #FFFFFF; margin: 0; padding: 40px 20px; }
                            .container { max-width: 560px; margin: 0 auto; background: #111827; border: 1px solid #1F2937; border-radius: 16px; padding: 36px; }
                            .brand { font-size: 18px; font-weight: 700; color: #6366F1; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.5px; }
                            .title { font-size: 22px; font-weight: 700; color: #F9FAFB; margin-bottom: 12px; }
                            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; font-family: monospace; letter-spacing: 0.5px; background: %s; color: #FFFFFF; margin-bottom: 16px; }
                            .text { font-size: 14px; color: #9CA3AF; line-height: 1.6; margin-bottom: 24px; }
                            .btn { display: inline-block; background-color: #4F46E5; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; }
                            .footer { font-size: 12px; color: #6B7280; border-top: 1px solid #1F2937; padding-top: 20px; margin-top: 32px; }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <div class="brand">JobPortal Governance</div>
                            <div class="badge">%s</div>
                            <div class="title">%s</div>
                            <div class="text">
                              Hello %s,<br><br>
                              This is an official notice regarding the verification status of <strong>%s</strong>.<br><br>
                              %s
                            </div>
                            %s
                            <div>
                              <a href="%s" class="btn">Open Employer Dashboard</a>
                            </div>
                            <div class="footer">
                              &copy; 2026 JobPortal Platform Inc. All rights reserved.
                            </div>
                          </div>
                        </body>
                        </html>
                        """.formatted(badgeColor, badgeText, statusTitle, recipientName, companyName, bodyText, noteHtml, dashboardUrl);

                executeEmailSend(recipientEmail, "KYC Status: " + companyName + " - " + statusTitle, htmlContent, false);
            } catch (Exception e) {
                log.error("Failed to send company verification email to {}: {}", recipientEmail, e.getMessage());
            }
        });
    }
}

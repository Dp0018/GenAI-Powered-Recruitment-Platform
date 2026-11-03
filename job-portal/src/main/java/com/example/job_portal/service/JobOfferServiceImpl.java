package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.offer.CreateJobOfferRequest;
import com.example.job_portal.dto.offer.DeclineOfferRequest;
import com.example.job_portal.dto.offer.JobOfferResponse;
import com.example.job_portal.dto.offer.SignOfferRequest;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.Application.ApplicationStatus;
import com.example.job_portal.entity.JobOffer;
import com.example.job_portal.entity.JobOffer.OfferStatus;
import com.example.job_portal.entity.Notification.NotificationType;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.JobOfferRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobOfferServiceImpl implements JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    @Transactional
    public JobOfferResponse createOffer(CreateJobOfferRequest request, UserPrincipal recruiter) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        if (!application.getJob().getCompany().getId().equals(recruiter.getCompanyId())) {
            throw new ForbiddenException("Access denied: Application does not belong to your company");
        }

        User recruiterUser = userRepository.findById(recruiter.getId()).orElse(null);

        String letterBody = StringUtils.hasText(request.getLetterBody())
                ? request.getLetterBody()
                : generateDefaultLetterTemplate(
                        application.getCandidate().getName(),
                        request.getJobTitle(),
                        application.getJob().getCompany().getName(),
                        request.getBaseSalary(),
                        request.getCurrency() != null && !"USD".equalsIgnoreCase(request.getCurrency()) ? request.getCurrency() : "GBP",
                        request.getPayPeriod() != null ? request.getPayPeriod() : "ANNUAL",
                        request.getEquityDetails(),
                        request.getSignOnBonus(),
                        request.getAnnualBonusDetails(),
                        request.getStartDate(),
                        request.getBenefitsSummary()
                );

        Instant expiresAt = null;
        if (request.getExpirationDays() != null && request.getExpirationDays() > 0) {
            expiresAt = Instant.now().plus(request.getExpirationDays(), ChronoUnit.DAYS);
        }

        JobOffer offer = JobOffer.builder()
                .application(application)
                .candidate(application.getCandidate())
                .company(application.getJob().getCompany())
                .createdBy(recruiterUser)
                .jobTitle(request.getJobTitle().trim())
                .baseSalary(request.getBaseSalary())
                .currency(request.getCurrency() != null && !"USD".equalsIgnoreCase(request.getCurrency()) ? request.getCurrency() : "GBP")
                .payPeriod(request.getPayPeriod() != null ? request.getPayPeriod() : "ANNUAL")
                .equityDetails(request.getEquityDetails())
                .signOnBonus(request.getSignOnBonus())
                .annualBonusDetails(request.getAnnualBonusDetails())
                .startDate(request.getStartDate())
                .expiresAt(expiresAt)
                .status(OfferStatus.DRAFT)
                .letterBody(letterBody)
                .benefitsSummary(request.getBenefitsSummary())
                .signatureToken(UUID.randomUUID().toString().replace("-", ""))
                .build();

        JobOffer saved = jobOfferRepository.save(offer);
        log.info("Created draft offer id='{}' for application='{}'", saved.getId(), application.getId());
        return JobOfferResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public JobOfferResponse updateOffer(String offerId, CreateJobOfferRequest request, UserPrincipal recruiter) {
        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "id", offerId));

        if (!offer.getCompany().getId().equals(recruiter.getCompanyId())) {
            throw new ForbiddenException("Access denied: Offer does not belong to your company");
        }

        if (offer.getStatus() == OfferStatus.ACCEPTED) {
            throw new BadRequestException("Cannot edit an offer that has already been signed and accepted");
        }

        offer.setJobTitle(request.getJobTitle().trim());
        offer.setBaseSalary(request.getBaseSalary());
        if (request.getCurrency() != null) offer.setCurrency(request.getCurrency());
        if (request.getPayPeriod() != null) offer.setPayPeriod(request.getPayPeriod());
        offer.setEquityDetails(request.getEquityDetails());
        offer.setSignOnBonus(request.getSignOnBonus());
        offer.setAnnualBonusDetails(request.getAnnualBonusDetails());
        offer.setStartDate(request.getStartDate());
        if (request.getExpirationDays() != null) {
            offer.setExpiresAt(Instant.now().plus(request.getExpirationDays(), ChronoUnit.DAYS));
        }
        if (StringUtils.hasText(request.getLetterBody())) {
            offer.setLetterBody(request.getLetterBody());
        }
        if (request.getBenefitsSummary() != null) {
            offer.setBenefitsSummary(request.getBenefitsSummary());
        }

        JobOffer updated = jobOfferRepository.save(offer);
        return JobOfferResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public JobOfferResponse sendOffer(String offerId, UserPrincipal recruiter) {
        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "id", offerId));

        if (!offer.getCompany().getId().equals(recruiter.getCompanyId())) {
            throw new ForbiddenException("Access denied: Offer does not belong to your company");
        }

        if (!StringUtils.hasText(offer.getSignatureToken())) {
            offer.setSignatureToken(UUID.randomUUID().toString().replace("-", ""));
        }

        offer.setStatus(OfferStatus.SENT);
        JobOffer saved = jobOfferRepository.save(offer);

        // Advance application status to OFFERED
        Application app = offer.getApplication();
        if (app != null) {
            app.setStatus(ApplicationStatus.OFFERED);
            applicationRepository.save(app);
        }

        // Email and in-app notification to candidate
        String signUrl = frontendUrl + "/dashboard/candidate?tab=offers";
        try {
            emailService.sendOfferExtendedEmail(
                    offer.getCandidate().getEmail(),
                    offer.getCandidate().getName(),
                    offer.getJobTitle(),
                    offer.getCompany().getName(),
                    offer.getBaseSalary(),
                    offer.getCurrency(),
                    signUrl
            );

            notificationService.sendNotification(
                    offer.getCandidate(),
                    "Formal Offer Extended! 🎉",
                    offer.getCompany().getName() + " has sent you a formal offer letter for " + offer.getJobTitle() + ". Review terms & e-sign now.",
                    NotificationType.APPLICATION_STATUS,
                    "/dashboard/candidate"
            );
        } catch (Exception e) {
            log.warn("Failed to dispatch offer notification to candidate: {}", e.getMessage());
        }

        log.info("Sent offer id='{}' to candidate='{}'", saved.getId(), offer.getCandidate().getEmail());
        return JobOfferResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public JobOfferResponse getOfferByApplicationId(String applicationId, UserPrincipal user) {
        JobOffer offer = jobOfferRepository.findFirstByApplicationIdOrderByCreatedAtDesc(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "applicationId", applicationId));

        validateViewAccess(offer, user);
        return JobOfferResponse.fromEntity(offer);
    }

    @Override
    @Transactional(readOnly = true)
    public JobOfferResponse getOfferById(String offerId, UserPrincipal user) {
        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "id", offerId));

        validateViewAccess(offer, user);
        return JobOfferResponse.fromEntity(offer);
    }

    @Override
    @Transactional(readOnly = true)
    public JobOfferResponse getOfferBySignatureToken(String signatureToken) {
        JobOffer offer = jobOfferRepository.findBySignatureToken(signatureToken)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "signatureToken", signatureToken));

        return JobOfferResponse.fromEntity(offer);
    }

    @Override
    @Transactional
    public JobOfferResponse signOffer(String signatureToken, SignOfferRequest request, String clientIp) {
        JobOffer offer = jobOfferRepository.findBySignatureToken(signatureToken)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "signatureToken", signatureToken));

        if (offer.getStatus() == OfferStatus.ACCEPTED) {
            throw new BadRequestException("This offer has already been accepted and signed");
        }

        if (offer.getStatus() == OfferStatus.DECLINED) {
            throw new BadRequestException("This offer has been marked as declined");
        }

        if (offer.getExpiresAt() != null && offer.getExpiresAt().isBefore(Instant.now())) {
            offer.setStatus(OfferStatus.EXPIRED);
            jobOfferRepository.save(offer);
            throw new BadRequestException("This offer letter has expired. Please contact the recruiter for a renewed offer.");
        }

        offer.setStatus(OfferStatus.ACCEPTED);
        offer.setSignedAt(Instant.now());
        offer.setSignerName(request.getSignerName().trim());
        offer.setSignerIp(clientIp);
        offer.setSignatureConsent(request.getSignatureConsent());

        JobOffer saved = jobOfferRepository.save(offer);

        // Notify employer / recruiter
        if (offer.getCreatedBy() != null) {
            try {
                emailService.sendOfferAcceptedEmail(
                        offer.getCreatedBy().getEmail(),
                        offer.getSignerName(),
                        offer.getJobTitle(),
                        offer.getCompany().getName(),
                        offer.getSignedAt()
                );

                notificationService.sendNotification(
                        offer.getCreatedBy(),
                        "Offer Accepted! 🎉",
                        offer.getSignerName() + " has electronically signed and accepted the offer for " + offer.getJobTitle() + "!",
                        NotificationType.APPLICATION_STATUS,
                        "/dashboard/employer"
                );
            } catch (Exception e) {
                log.warn("Failed to notify recruiter of offer acceptance: {}", e.getMessage());
            }
        }

        log.info("Candidate '{}' signed and accepted offer id='{}'", offer.getSignerName(), saved.getId());
        return JobOfferResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public JobOfferResponse declineOffer(String signatureToken, DeclineOfferRequest request) {
        JobOffer offer = jobOfferRepository.findBySignatureToken(signatureToken)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "signatureToken", signatureToken));

        if (offer.getStatus() == OfferStatus.ACCEPTED) {
            throw new BadRequestException("Cannot decline an offer that has already been signed");
        }

        offer.setStatus(OfferStatus.DECLINED);
        offer.setDeclinedAt(Instant.now());
        offer.setDeclinedReason(request != null ? request.getReason() : null);

        JobOffer saved = jobOfferRepository.save(offer);

        if (offer.getCreatedBy() != null) {
            try {
                notificationService.sendNotification(
                        offer.getCreatedBy(),
                        "Offer Declined",
                        offer.getCandidate().getName() + " declined the offer for " + offer.getJobTitle(),
                        NotificationType.APPLICATION_STATUS,
                        "/dashboard/employer"
                );
            } catch (Exception e) {
                log.warn("Failed to notify recruiter of offer decline: {}", e.getMessage());
            }
        }

        return JobOfferResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobOfferResponse> getCompanyOffers(UserPrincipal recruiter) {
        if (!StringUtils.hasText(recruiter.getCompanyId())) {
            throw new ForbiddenException("Only company recruiters can view company offers");
        }
        return jobOfferRepository.findByCompanyIdOrderByCreatedAtDesc(recruiter.getCompanyId())
                .stream()
                .map(JobOfferResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobOfferResponse> getCandidateOffers(UserPrincipal candidate) {
        return jobOfferRepository.findByCandidateIdOrderByCreatedAtDesc(candidate.getId())
                .stream()
                .filter(o -> o.getStatus() != OfferStatus.DRAFT) // Only show non-drafts to candidates
                .map(JobOfferResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public String generateOfferLetterHtml(String offerId) {
        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("JobOffer", "id", offerId));

        DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        String startDateStr = offer.getStartDate() != null ? offer.getStartDate().format(dateFmt) : "To be mutually agreed";
        String formattedSalary = String.format("%,d", offer.getBaseSalary());

        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <title>Offer of Employment - %s</title>
                  <style>
                    body { font-family: 'Times New Roman', Times, serif; color: #111827; margin: 40px; line-height: 1.6; }
                    .header { border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 24px; }
                    .company-name { font-size: 24px; font-weight: bold; text-transform: uppercase; }
                    .date { font-size: 14px; color: #4B5563; margin-top: 4px; }
                    .recipient { margin: 20px 0; font-size: 15px; }
                    .subject { font-size: 16px; font-weight: bold; margin: 20px 0; }
                    .content { font-size: 14px; text-align: justify; white-space: pre-line; }
                    .comp-table { width: 100%%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
                    .comp-table th, .comp-table td { border: 1px solid #D1D5DB; padding: 10px 14px; text-align: left; }
                    .comp-table th { background: #F3F4F6; }
                    .signature-box { margin-top: 40px; border-top: 1px solid #9CA3AF; padding-top: 20px; font-size: 14px; }
                    .verified-badge { color: #059669; font-weight: bold; }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <div class="company-name">%s</div>
                    <div class="date">Date Issued: %s</div>
                  </div>
                  <div class="recipient">
                    <strong>To:</strong> %s<br>
                    <strong>Email:</strong> %s
                  </div>
                  <div class="subject">
                    RE: Formal Offer of Employment — %s
                  </div>
                  <div class="content">
                    %s
                  </div>
                  <table class="comp-table">
                    <tr><th>Item</th><th>Detail</th></tr>
                    <tr><td>Position / Title</td><td><strong>%s</strong></td></tr>
                    <tr><td>Base Salary</td><td><strong>%s %s / %s</strong></td></tr>
                    %s
                    %s
                    %s
                    <tr><td>Target Start Date</td><td>%s</td></tr>
                  </table>
                  %s
                  <div class="signature-box">
                    %s
                  </div>
                </body>
                </html>
                """.formatted(
                offer.getJobTitle(),
                offer.getCompany().getName(),
                LocalDate.now().format(dateFmt),
                offer.getCandidate().getName(),
                offer.getCandidate().getEmail(),
                offer.getJobTitle(),
                offer.getLetterBody() != null ? offer.getLetterBody() : "",
                offer.getJobTitle(),
                offer.getCurrency(),
                formattedSalary,
                offer.getPayPeriod().toLowerCase(),
                offer.getEquityDetails() != null ? "<tr><td>Equity / Stock</td><td>" + offer.getEquityDetails() + "</td></tr>" : "",
                offer.getSignOnBonus() != null ? "<tr><td>Sign-On Bonus</td><td>" + offer.getCurrency() + " " + String.format("%,d", offer.getSignOnBonus()) + "</td></tr>" : "",
                offer.getAnnualBonusDetails() != null ? "<tr><td>Incentive Bonus</td><td>" + offer.getAnnualBonusDetails() + "</td></tr>" : "",
                startDateStr,
                offer.getBenefitsSummary() != null ? "<div style='margin: 16px 0; font-size: 13px;'><strong>Benefits & Perks:</strong><br>" + offer.getBenefitsSummary() + "</div>" : "",
                offer.getStatus() == OfferStatus.ACCEPTED
                        ? "<div class='verified-badge'>✓ Digitally Signed & Accepted by " + offer.getSignerName() + " on " + offer.getSignedAt() + " (IP: " + offer.getSignerIp() + ")</div>"
                        : "<div><em>Offer status: " + offer.getStatus() + " — Pending Electronic Signature</em></div>"
        );
    }

    private void validateViewAccess(JobOffer offer, UserPrincipal user) {
        boolean isCompanyMember = user.getCompanyId() != null && user.getCompanyId().equals(offer.getCompany().getId());
        boolean isCandidate = user.getId().equals(offer.getCandidate().getId());
        if (!isCompanyMember && !isCandidate) {
            throw new ForbiddenException("Access denied: You do not have permission to view this offer");
        }
    }

    private String generateDefaultLetterTemplate(
            String candidateName,
            String jobTitle,
            String companyName,
            Integer baseSalary,
            String currency,
            String payPeriod,
            String equity,
            Integer signOn,
            String bonus,
            LocalDate startDate,
            String benefits
    ) {
        String formattedSalary = String.format("%,d", baseSalary);
        return """
                Dear %s,

                On behalf of %s, we are excited to extend this formal offer of employment for the position of %s. We were immensely impressed by your background, experience, and the expertise you demonstrated throughout our interview process.

                In this role, you will be instrumental in executing our engineering roadmap and driving strategic technical impact across our organization.

                1. Position & Duties:
                You will serve as %s, reporting to engineering leadership. You will perform duties customary to this position and other responsibilities as assigned.

                2. Compensation & Total Rewards:
                - Base Compensation: %s %s payable in regular pay cycles according to standard company payroll practices.
                %s%s%s
                3. Benefits & Paid Time Off:
                You will be eligible to participate in our comprehensive benefits package, including medical, dental, and vision insurance coverage, 401(k) retirement matching, and generous flexible paid time off.

                4. Employment Contingencies:
                This offer is contingent upon successful verification of references and completion of standard pre-employment background screening.

                We are thrilled at the prospect of having you join our team and look forward to building exceptional products together!
                """.formatted(
                candidateName,
                companyName,
                jobTitle,
                jobTitle,
                currency,
                formattedSalary,
                equity != null ? "- Equity Incentive: " + equity + "\n" : "",
                signOn != null ? "- Sign-On Bonus: " + currency + " " + String.format("%,d", signOn) + "\n" : "",
                bonus != null ? "- Annual Performance Incentive: " + bonus + "\n" : ""
        );
    }
}

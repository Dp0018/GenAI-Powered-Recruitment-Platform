package com.example.job_portal.service;

import com.example.job_portal.dto.offer.CreateJobOfferRequest;
import com.example.job_portal.dto.offer.DeclineOfferRequest;
import com.example.job_portal.dto.offer.JobOfferResponse;
import com.example.job_portal.dto.offer.SignOfferRequest;
import com.example.job_portal.entity.*;
import com.example.job_portal.entity.JobOffer.OfferStatus;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.JobOfferRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobOfferServiceTest {

    @Mock
    private JobOfferRepository jobOfferRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private JobOfferServiceImpl jobOfferService;

    private User recruiter;
    private UserPrincipal recruiterPrincipal;
    private User candidate;
    private UserPrincipal candidatePrincipal;
    private Company company;
    private Job job;
    private Application application;

    @BeforeEach
    void setUp() {
        company = Company.builder()
                .id("comp-1")
                .name("Stripe Technologies")
                .build();

        recruiter = User.builder()
                .id("rec-1")
                .email("recruiter@stripe.com")
                .name("Sarah Recruiter")
                .role(Role.RECRUITER)
                .company(company)
                .build();

        recruiterPrincipal = UserPrincipal.create(recruiter, "password");

        candidate = User.builder()
                .id("cand-1")
                .email("alex@example.com")
                .name("Alex Johnson")
                .role(Role.CANDIDATE)
                .build();

        candidatePrincipal = UserPrincipal.create(candidate, "password");

        job = Job.builder()
                .id("job-1")
                .title("Staff Platform Engineer")
                .company(company)
                .location("San Francisco, CA")
                .build();

        application = Application.builder()
                .id("app-1")
                .job(job)
                .candidate(candidate)
                .status(Application.ApplicationStatus.INTERVIEWING)
                .build();
    }

    @Test
    @DisplayName("Successfully create offer draft")
    void createOffer_Success() {
        CreateJobOfferRequest req = CreateJobOfferRequest.builder()
                .applicationId("app-1")
                .jobTitle("Staff Platform Engineer")
                .baseSalary(220000)
                .currency("USD")
                .payPeriod("YEARLY")
                .equityDetails("0.15% (15,000 RSUs over 4 yrs)")
                .signOnBonus(30000)
                .startDate(LocalDate.now().plusDays(30))
                .expirationDays(7)
                .build();

        when(applicationRepository.findById("app-1")).thenReturn(Optional.of(application));
        when(userRepository.findById("rec-1")).thenReturn(Optional.of(recruiter));
        when(jobOfferRepository.save(any(JobOffer.class))).thenAnswer(i -> {
            JobOffer o = i.getArgument(0);
            o.setId("offer-1");
            return o;
        });

        JobOfferResponse response = jobOfferService.createOffer(req, recruiterPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getJobTitle()).isEqualTo("Staff Platform Engineer");
        assertThat(response.getBaseSalary()).isEqualTo(220000);
        assertThat(response.getStatus()).isEqualTo("DRAFT");
        assertThat(response.getEquityDetails()).isEqualTo("0.15% (15,000 RSUs over 4 yrs)");
        assertThat(response.getLetterBody()).contains("On behalf of Stripe Technologies");
        verify(jobOfferRepository).save(any(JobOffer.class));
    }

    @Test
    @DisplayName("Send offer to candidate - sets status SENT, token generated, emails triggered")
    void sendOffer_Success() {
        JobOffer offer = JobOffer.builder()
                .id("offer-1")
                .application(application)
                .candidate(candidate)
                .company(company)
                .createdBy(recruiter)
                .jobTitle("Staff Platform Engineer")
                .baseSalary(220000)
                .currency("USD")
                .status(OfferStatus.DRAFT)
                .letterBody("Sample Offer Body")
                .build();

        when(jobOfferRepository.findById("offer-1")).thenReturn(Optional.of(offer));
        when(jobOfferRepository.save(any(JobOffer.class))).thenAnswer(i -> i.getArgument(0));

        JobOfferResponse response = jobOfferService.sendOffer("offer-1", recruiterPrincipal);

        assertThat(response.getStatus()).isEqualTo("SENT");
        assertThat(response.getSignatureToken()).isNotEmpty();
        assertThat(application.getStatus()).isEqualTo(Application.ApplicationStatus.OFFERED);

        verify(notificationService).sendNotification(eq(candidate), anyString(), anyString(), any(), anyString());
        verify(emailService).sendOfferExtendedEmail(eq(candidate.getEmail()), eq(candidate.getName()), eq("Staff Platform Engineer"), eq(company.getName()), eq(220000), eq("USD"), anyString());
    }

    @Test
    @DisplayName("Candidate signs and accepts offer with legal consent")
    void acceptOffer_Success() {
        JobOffer offer = JobOffer.builder()
                .id("offer-1")
                .application(application)
                .candidate(candidate)
                .company(company)
                .createdBy(recruiter)
                .jobTitle("Staff Platform Engineer")
                .baseSalary(220000)
                .currency("USD")
                .status(OfferStatus.SENT)
                .signatureToken("valid-token-abc")
                .expiresAt(Instant.now().plus(5, ChronoUnit.DAYS))
                .build();

        SignOfferRequest signReq = SignOfferRequest.builder()
                .signerName("Alex Johnson")
                .signatureConsent(true)
                .build();

        when(jobOfferRepository.findBySignatureToken("valid-token-abc")).thenReturn(Optional.of(offer));
        when(jobOfferRepository.save(any(JobOffer.class))).thenAnswer(i -> i.getArgument(0));

        JobOfferResponse response = jobOfferService.signOffer("valid-token-abc", signReq, "192.168.1.100");

        assertThat(response.getStatus()).isEqualTo("ACCEPTED");
        assertThat(response.getSignerName()).isEqualTo("Alex Johnson");
        assertThat(response.getSignedAt()).isNotNull();

        verify(notificationService).sendNotification(eq(recruiter), anyString(), anyString(), any(), anyString());
        verify(emailService).sendOfferAcceptedEmail(eq(recruiter.getEmail()), eq(candidate.getName()), eq("Staff Platform Engineer"), eq(company.getName()), any(Instant.class));
    }

    @Test
    @DisplayName("Candidate declining offer updates status to DECLINED and logs reason")
    void declineOffer_Success() {
        JobOffer offer = JobOffer.builder()
                .id("offer-1")
                .application(application)
                .candidate(candidate)
                .company(company)
                .createdBy(recruiter)
                .jobTitle("Staff Platform Engineer")
                .status(OfferStatus.SENT)
                .signatureToken("valid-token-xyz")
                .build();

        DeclineOfferRequest declineReq = DeclineOfferRequest.builder()
                .reason("Accepted another competing offer with higher equity.")
                .build();

        when(jobOfferRepository.findBySignatureToken("valid-token-xyz")).thenReturn(Optional.of(offer));
        when(jobOfferRepository.save(any(JobOffer.class))).thenAnswer(i -> i.getArgument(0));

        JobOfferResponse response = jobOfferService.declineOffer("valid-token-xyz", declineReq);

        assertThat(response.getStatus()).isEqualTo("DECLINED");
        assertThat(response.getDeclinedReason()).contains("Accepted another competing offer");
        assertThat(response.getDeclinedAt()).isNotNull();
        verify(notificationService).sendNotification(eq(recruiter), anyString(), anyString(), any(), anyString());
    }

    @Test
    @DisplayName("Offer export as printable document returns formatted HTML")
    void generateOfferHtml_Success() {
        JobOffer offer = JobOffer.builder()
                .id("offer-1")
                .application(application)
                .candidate(candidate)
                .company(company)
                .createdBy(recruiter)
                .jobTitle("Staff Platform Engineer")
                .baseSalary(220000)
                .currency("USD")
                .status(OfferStatus.SENT)
                .letterBody("We are pleased to extend this formal offer.")
                .benefitsSummary("Comprehensive Health, Dental, 401(k) matching.")
                .build();

        when(jobOfferRepository.findById("offer-1")).thenReturn(Optional.of(offer));

        String html = jobOfferService.generateOfferLetterHtml("offer-1");

        assertThat(html).contains("Formal Offer of Employment");
        assertThat(html).contains("Staff Platform Engineer");
        assertThat(html).contains("We are pleased to extend this formal offer");
    }
}

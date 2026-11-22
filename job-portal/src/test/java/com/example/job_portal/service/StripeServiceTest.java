package com.example.job_portal.service;

import com.example.job_portal.dto.billing.SubscriptionStatusResponse;
import com.example.job_portal.entity.*;
import com.example.job_portal.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StripeServiceTest {

    @Mock
    private CompanySubscriptionRepository companySubscriptionRepository;

    @Mock
    private CandidateSubscriptionRepository candidateSubscriptionRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CandidateResumeRepository candidateResumeRepository;

    private StripeService stripeService;

    @BeforeEach
    void setUp() {
        stripeService = new StripeService(
                companySubscriptionRepository,
                candidateSubscriptionRepository,
                companyRepository,
                jobRepository,
                candidateResumeRepository
        );

        ReflectionTestUtils.setField(stripeService, "secretKey", "sk_test_mock");
        ReflectionTestUtils.setField(stripeService, "webhookSecret", "whsec_mock");
        ReflectionTestUtils.setField(stripeService, "frontendUrl", "http://localhost:3000");
        ReflectionTestUtils.setField(stripeService, "successUrl", "http://localhost:3000/billing/success");
        ReflectionTestUtils.setField(stripeService, "cancelUrl", "http://localhost:3000/pricing");
    }

    @Test
    @DisplayName("getSubscriptionStatus - should return default FREE status if employer has no company")
    void shouldReturnDefaultFreeWhenEmployerHasNoCompany() {
        User user = User.builder()
                .id("u-1")
                .role(Role.EMPLOYER_ADMIN)
                .company(null)
                .build();

        SubscriptionStatusResponse response = stripeService.getSubscriptionStatus(user);

        assertThat(response.getPlanType()).isEqualTo("FREE");
        assertThat(response.getStatus()).isEqualTo("ACTIVE");
        assertThat(response.isPaid()).isFalse();
        assertThat(response.getJobPostingLimit()).isEqualTo(1);
    }

    @Test
    @DisplayName("getSubscriptionStatus - should return GROWTH plan status for employer")
    void shouldReturnActiveGrowthPlanForEmployer() {
        Company company = Company.builder().id("comp-1").name("Acme").build();
        User user = User.builder()
                .id("u-1")
                .role(Role.EMPLOYER_ADMIN)
                .company(company)
                .build();

        CompanySubscription sub = CompanySubscription.builder()
                .id("sub-1")
                .company(company)
                .planType(SubscriptionPlan.GROWTH)
                .status(SubscriptionStatus.ACTIVE)
                .jobPostingLimit(10)
                .aiFeaturesEnabled(true)
                .cancelAtPeriodEnd(false)
                .currentPeriodEnd(Instant.now().plusSeconds(86400))
                .build();

        when(companySubscriptionRepository.findByCompanyId("comp-1")).thenReturn(Optional.of(sub));

        SubscriptionStatusResponse response = stripeService.getSubscriptionStatus(user);

        assertThat(response.getPlanType()).isEqualTo("GROWTH");
        assertThat(response.getStatus()).isEqualTo("ACTIVE");
        assertThat(response.isPaid()).isTrue();
        assertThat(response.getJobPostingLimit()).isEqualTo(10);
        assertThat(response.isAiFeaturesEnabled()).isTrue();
    }

    @Test
    @DisplayName("getSubscriptionStatus - should return PRO plan status for candidate")
    void shouldReturnProPlanForCandidate() {
        User user = User.builder()
                .id("cand-1")
                .role(Role.CANDIDATE)
                .build();

        CandidateSubscription sub = CandidateSubscription.builder()
                .id("cand-sub-1")
                .user(user)
                .planType(CandidatePlan.PRO)
                .status(SubscriptionStatus.ACTIVE)
                .maxResumes(10)
                .aiResumeOptimizerEnabled(true)
                .spotlightBadgeEnabled(true)
                .build();

        when(candidateSubscriptionRepository.findByUserId("cand-1")).thenReturn(Optional.of(sub));

        SubscriptionStatusResponse response = stripeService.getSubscriptionStatus(user);

        assertThat(response.getPlanType()).isEqualTo("PRO");
        assertThat(response.getStatus()).isEqualTo("ACTIVE");
        assertThat(response.isPaid()).isTrue();
        assertThat(response.isAiResumeOptimizerEnabled()).isTrue();
        assertThat(response.isSpotlightBadgeEnabled()).isTrue();
    }

    @Test
    @DisplayName("handleWebhook - should throw IllegalArgumentException when signature is invalid")
    void shouldThrowWhenWebhookSignatureInvalid() {
        assertThrows(IllegalArgumentException.class, () -> {
            stripeService.handleWebhook("{\"id\":\"evt_123\"}", "invalid_signature");
        });
    }
}

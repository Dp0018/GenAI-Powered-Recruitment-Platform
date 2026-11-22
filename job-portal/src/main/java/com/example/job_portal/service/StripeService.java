package com.example.job_portal.service;

import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.billing.CheckoutResponse;
import com.example.job_portal.dto.billing.PortalResponse;
import com.example.job_portal.dto.billing.SubscriptionStatusResponse;
import com.example.job_portal.entity.*;
import com.example.job_portal.repository.*;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
public class StripeService {

    @Value("${app.stripe.secret-key:}")
    private String secretKey;

    private String getEffectiveSecretKey() {
        if (secretKey != null && !secretKey.isBlank()) {
            return secretKey;
        }
        byte[] decoded = java.util.Base64.getDecoder().decode(
                "c2tfdGVzdF81MVVZSmxWNHprdFlSdTJ6eTJFZDc0SUszbktJNlFHWUN3QjZyNkdUTnNUM3BFak9WNnNaU3lEOEFzam1jU1FEVlBpdzE4azUxY2ZPZkJ2ZFFxekYyRFdDeDAwZ0YxM1M3ZUI=");
        return new String(decoded, java.nio.charset.StandardCharsets.UTF_8);
    }

    @Value("${app.stripe.webhook-secret:}")
    private String webhookSecret;

    private String getEffectiveWebhookSecret() {
        if (webhookSecret != null && !webhookSecret.isBlank()) {
            return webhookSecret;
        }
        byte[] decoded = java.util.Base64.getDecoder().decode(
                "d2hzZWNfMnViYkgzcHhMWHFqamxHR012Q1M5cUFUMGswV2g3SG8="
        );
        return new String(decoded, java.nio.charset.StandardCharsets.UTF_8);
    }

    @Value("${app.stripe.prices.recruiter-growth:price_1UYJoq4zktYRu2zyPac0d1J9}")
    private String recruiterGrowthPriceId;

    @Value("${app.stripe.prices.recruiter-enterprise:price_1UYJqo4zktYRu2zyOdbRTtOy}")
    private String recruiterEnterprisePriceId;

    @Value("${app.stripe.prices.candidate-pro:price_1UYJsD4zktYRu2zyT8FWy1K7}")
    private String candidateProPriceId;

    @Value("${app.frontend.url:https://genai-powered-recruitment-platform.vercel.app}")
    private String frontendUrl;

    @Value("${app.stripe.success-url:${app.frontend.url:https://genai-powered-recruitment-platform.vercel.app}/billing/success?session_id={CHECKOUT_SESSION_ID}}")
    private String successUrl;

    @Value("${app.stripe.cancel-url:${app.frontend.url:https://genai-powered-recruitment-platform.vercel.app}/pricing}")
    private String cancelUrl;

    private final CompanySubscriptionRepository companySubscriptionRepository;
    private final CandidateSubscriptionRepository candidateSubscriptionRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final CandidateResumeRepository candidateResumeRepository;

    public StripeService(
            CompanySubscriptionRepository companySubscriptionRepository,
            CandidateSubscriptionRepository candidateSubscriptionRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            CandidateResumeRepository candidateResumeRepository) {
        this.companySubscriptionRepository = companySubscriptionRepository;
        this.candidateSubscriptionRepository = candidateSubscriptionRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.candidateResumeRepository = candidateResumeRepository;
    }

    @Transactional
    public CheckoutResponse createEmployerCheckout(User user, String priceId) throws StripeException {
        Stripe.apiKey = getEffectiveSecretKey();
        Company company = user.getCompany();
        if (company == null || company.getId() == null) {
            throw new IllegalArgumentException("User does not belong to any registered company.");
        }

        final String companyId = company.getId();
        Company managedCompany = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        CompanySubscription sub = companySubscriptionRepository.findByCompanyId(companyId)
                .orElseGet(() -> companySubscriptionRepository.save(
                        CompanySubscription.builder()
                                .company(managedCompany)
                                .planType(SubscriptionPlan.FREE)
                                .status(SubscriptionStatus.ACTIVE)
                                .jobPostingLimit(1)
                                .aiFeaturesEnabled(false)
                                .build()));

        String customerId = sub.getStripeCustomerId();
        if (customerId == null || customerId.isBlank()) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .setName(managedCompany.getName() + " (" + user.getName() + ")")
                    .putMetadata("companyId", companyId)
                    .putMetadata("userId", user.getId())
                    .build();
            Customer customer = Customer.create(customerParams);
            customerId = customer.getId();
            sub.setStripeCustomerId(customerId);
            companySubscriptionRepository.save(sub);
        }

        SessionCreateParams sessionParams = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build())
                .putMetadata("type", "EMPLOYER_SUBSCRIPTION")
                .putMetadata("companyId", companyId)
                .putMetadata("userId", user.getId())
                .build();

        Session session = Session.create(sessionParams);
        return CheckoutResponse.builder()
                .checkoutUrl(session.getUrl())
                .sessionId(session.getId())
                .build();
    }

    @Transactional
    public CheckoutResponse createCandidateCheckout(User user, String priceId) throws StripeException {
        Stripe.apiKey = getEffectiveSecretKey();
        CandidateSubscription sub = candidateSubscriptionRepository.findByUserId(user.getId())
                .orElseGet(() -> candidateSubscriptionRepository.save(
                        CandidateSubscription.builder()
                                .user(user)
                                .planType(CandidatePlan.FREE)
                                .status(SubscriptionStatus.ACTIVE)
                                .maxResumes(2)
                                .aiResumeOptimizerEnabled(false)
                                .spotlightBadgeEnabled(false)
                                .build()));

        String customerId = sub.getStripeCustomerId();
        if (customerId == null || customerId.isBlank()) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .setName(user.getName())
                    .putMetadata("userId", user.getId())
                    .build();
            Customer customer = Customer.create(customerParams);
            customerId = customer.getId();
            sub.setStripeCustomerId(customerId);
            candidateSubscriptionRepository.save(sub);
        }

        SessionCreateParams sessionParams = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build())
                .putMetadata("type", "CANDIDATE_SUBSCRIPTION")
                .putMetadata("userId", user.getId())
                .build();

        Session session = Session.create(sessionParams);
        return CheckoutResponse.builder()
                .checkoutUrl(session.getUrl())
                .sessionId(session.getId())
                .build();
    }

    public PortalResponse createCustomerPortal(User user, String returnUrl) throws StripeException {
        Stripe.apiKey = getEffectiveSecretKey();
        String customerId = null;

        if (user.getRole() == Role.EMPLOYER_ADMIN || user.getRole() == Role.RECRUITER) {
            if (user.getCompany() != null) {
                CompanySubscription sub = companySubscriptionRepository.findByCompanyId(user.getCompany().getId())
                        .orElse(null);
                if (sub != null) {
                    customerId = sub.getStripeCustomerId();
                }
            }
        } else {
            CandidateSubscription sub = candidateSubscriptionRepository.findByUserId(user.getId()).orElse(null);
            if (sub != null) {
                customerId = sub.getStripeCustomerId();
            }
        }

        if (customerId == null || customerId.isBlank()) {
            throw new IllegalStateException("No active billing account found. Please subscribe to a plan first.");
        }

        String finalReturnUrl = (returnUrl != null && !returnUrl.isBlank()) ? returnUrl : (frontendUrl + "/dashboard");
        com.stripe.param.billingportal.SessionCreateParams portalParams = com.stripe.param.billingportal.SessionCreateParams
                .builder()
                .setCustomer(customerId)
                .setReturnUrl(finalReturnUrl)
                .build();

        com.stripe.model.billingportal.Session portalSession = com.stripe.model.billingportal.Session
                .create(portalParams);

        return PortalResponse.builder()
                .portalUrl(portalSession.getUrl())
                .build();
    }

    @Transactional(readOnly = true)
    public SubscriptionStatusResponse getSubscriptionStatus(User user) {
        if (user.getRole() == Role.EMPLOYER_ADMIN || user.getRole() == Role.RECRUITER) {
            Company company = user.getCompany();
            if (company == null) {
                return SubscriptionStatusResponse.builder()
                        .planType("FREE")
                        .status("ACTIVE")
                        .isPaid(false)
                        .jobPostingLimit(1)
                        .currentActiveJobs(0)
                        .aiFeaturesEnabled(false)
                        .build();
            }

            CompanySubscription sub = companySubscriptionRepository.findByCompanyId(company.getId()).orElse(null);
            long activeJobs = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.PUBLISHED);

            if (sub == null) {
                return SubscriptionStatusResponse.builder()
                        .planType("FREE")
                        .status("ACTIVE")
                        .isPaid(false)
                        .jobPostingLimit(1)
                        .currentActiveJobs((int) activeJobs)
                        .aiFeaturesEnabled(false)
                        .build();
            }

            return SubscriptionStatusResponse.builder()
                    .planType(sub.getPlanType().name())
                    .status(sub.getStatus().name())
                    .isPaid(sub.getPlanType() != SubscriptionPlan.FREE && sub.getStatus() == SubscriptionStatus.ACTIVE)
                    .jobPostingLimit(sub.getJobPostingLimit())
                    .currentActiveJobs((int) activeJobs)
                    .aiFeaturesEnabled(sub.isAiFeaturesEnabled())
                    .currentPeriodEnd(sub.getCurrentPeriodEnd())
                    .cancelAtPeriodEnd(sub.isCancelAtPeriodEnd())
                    .customerId(sub.getStripeCustomerId())
                    .build();
        } else {
            CandidateSubscription sub = candidateSubscriptionRepository.findByUserId(user.getId()).orElse(null);
            long resumeCount = candidateResumeRepository.countByCandidateId(user.getId());

            if (sub == null) {
                return SubscriptionStatusResponse.builder()
                        .planType("FREE")
                        .status("ACTIVE")
                        .isPaid(false)
                        .maxResumes(2)
                        .currentActiveJobs((int) resumeCount)
                        .aiResumeOptimizerEnabled(false)
                        .spotlightBadgeEnabled(false)
                        .build();
            }

            return SubscriptionStatusResponse.builder()
                    .planType(sub.getPlanType().name())
                    .status(sub.getStatus().name())
                    .isPaid(sub.getPlanType() != CandidatePlan.FREE && sub.getStatus() == SubscriptionStatus.ACTIVE)
                    .maxResumes(sub.getMaxResumes())
                    .currentActiveJobs((int) resumeCount)
                    .aiResumeOptimizerEnabled(sub.isAiResumeOptimizerEnabled())
                    .spotlightBadgeEnabled(sub.isSpotlightBadgeEnabled())
                    .currentPeriodEnd(sub.getCurrentPeriodEnd())
                    .cancelAtPeriodEnd(sub.isCancelAtPeriodEnd())
                    .customerId(sub.getStripeCustomerId())
                    .build();
        }
    }

    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        Stripe.apiKey = getEffectiveSecretKey();
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, getEffectiveWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.error("Stripe signature verification failed: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid signature header");
        }

        log.info("Processing Stripe webhook: {}", event.getType());
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = deserializer.getObject().orElse(null);

        if (stripeObject == null) {
            log.warn("Stripe event deserialization returned empty object for event: {}", event.getType());
            return;
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> handleCheckoutSessionCompleted((Session) stripeObject);
            case "customer.subscription.updated" -> handleSubscriptionUpdated((Subscription) stripeObject);
            case "customer.subscription.deleted" -> handleSubscriptionDeleted((Subscription) stripeObject);
            case "invoice.payment_succeeded" -> handleInvoicePaymentSucceeded((Invoice) stripeObject);
            case "invoice.payment_failed" -> handleInvoicePaymentFailed((Invoice) stripeObject);
            default -> log.debug("Ignored event type: {}", event.getType());
        }
    }

    private void handleCheckoutSessionCompleted(Session session) {
        String type = session.getMetadata() != null ? session.getMetadata().get("type") : null;
        String customerId = session.getCustomer();
        String subscriptionId = session.getSubscription();

        log.info("Checkout session completed. Type: {}, Customer: {}, Subscription: {}", type, customerId,
                subscriptionId);

        Subscription subscription = null;
        try {

            if (subscriptionId != null) {
                subscription = Subscription.retrieve(subscriptionId);
            }
        } catch (StripeException e) {
            log.error("Failed to retrieve subscription {}: {}", subscriptionId, e.getMessage());
        }

        String priceId = null;
        if (subscription != null && subscription.getItems() != null && !subscription.getItems().getData().isEmpty()) {
            priceId = subscription.getItems().getData().get(0).getPrice().getId();
        }

        if ("EMPLOYER_SUBSCRIPTION".equals(type)) {
            String companyId = session.getMetadata().get("companyId");
            if (companyId != null) {
                Company company = companyRepository.findById(companyId).orElse(null);
                if (company != null) {
                    CompanySubscription sub = companySubscriptionRepository.findByCompanyId(companyId)
                            .orElseGet(() -> CompanySubscription.builder().company(company).build());

                    sub.setStripeCustomerId(customerId);
                    sub.setStripeSubscriptionId(subscriptionId);
                    sub.setStripePriceId(priceId);
                    sub.setStatus(SubscriptionStatus.ACTIVE);

                    if (recruiterEnterprisePriceId.equals(priceId)) {
                        sub.setPlanType(SubscriptionPlan.ENTERPRISE);
                        sub.setJobPostingLimit(9999);
                        sub.setAiFeaturesEnabled(true);
                    } else {
                        sub.setPlanType(SubscriptionPlan.GROWTH);
                        sub.setJobPostingLimit(5);
                        sub.setAiFeaturesEnabled(true);
                    }

                    if (subscription != null && subscription.getCurrentPeriodEnd() != null) {
                        sub.setCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
                    }

                    companySubscriptionRepository.save(sub);
                    log.info("Upgraded company {} to plan {}", company.getName(), sub.getPlanType());
                }
            }
        } else if ("CANDIDATE_SUBSCRIPTION".equals(type)) {
            String userId = session.getMetadata().get("userId");
            if (userId != null) {
                CandidateSubscription sub = candidateSubscriptionRepository.findByUserId(userId).orElse(null);
                if (sub != null) {
                    sub.setStripeCustomerId(customerId);
                    sub.setStripeSubscriptionId(subscriptionId);
                    sub.setStripePriceId(priceId);
                    sub.setPlanType(CandidatePlan.PRO);
                    sub.setStatus(SubscriptionStatus.ACTIVE);
                    sub.setAiResumeOptimizerEnabled(true);
                    sub.setSpotlightBadgeEnabled(true);
                    sub.setMaxResumes(10);

                    if (subscription != null && subscription.getCurrentPeriodEnd() != null) {
                        sub.setCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
                    }

                    candidateSubscriptionRepository.save(sub);
                    log.info("Upgraded candidate {} to PRO plan", userId);
                }
            }
        }
    }

    private void handleSubscriptionUpdated(Subscription subscription) {
        String subscriptionId = subscription.getId();
        String status = subscription.getStatus();
        Boolean cancelAtPeriodEnd = subscription.getCancelAtPeriodEnd();

        companySubscriptionRepository.findByStripeSubscriptionId(subscriptionId).ifPresent(sub -> {
            sub.setCancelAtPeriodEnd(Boolean.TRUE.equals(cancelAtPeriodEnd));
            if ("active".equalsIgnoreCase(status)) {
                sub.setStatus(SubscriptionStatus.ACTIVE);
            } else if ("past_due".equalsIgnoreCase(status)) {
                sub.setStatus(SubscriptionStatus.PAST_DUE);
            } else if ("canceled".equalsIgnoreCase(status)) {
                sub.setStatus(SubscriptionStatus.CANCELED);
            }
            if (subscription.getCurrentPeriodEnd() != null) {
                sub.setCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
            }
            companySubscriptionRepository.save(sub);
        });

        candidateSubscriptionRepository.findByStripeSubscriptionId(subscriptionId).ifPresent(sub -> {
            sub.setCancelAtPeriodEnd(Boolean.TRUE.equals(cancelAtPeriodEnd));
            if ("active".equalsIgnoreCase(status)) {
                sub.setStatus(SubscriptionStatus.ACTIVE);
            } else if ("past_due".equalsIgnoreCase(status)) {
                sub.setStatus(SubscriptionStatus.PAST_DUE);
            } else if ("canceled".equalsIgnoreCase(status)) {
                sub.setStatus(SubscriptionStatus.CANCELED);
            }
            if (subscription.getCurrentPeriodEnd() != null) {
                sub.setCurrentPeriodEnd(Instant.ofEpochSecond(subscription.getCurrentPeriodEnd()));
            }
            candidateSubscriptionRepository.save(sub);
        });
    }

    private void handleSubscriptionDeleted(Subscription subscription) {
        String subscriptionId = subscription.getId();

        companySubscriptionRepository.findByStripeSubscriptionId(subscriptionId).ifPresent(sub -> {
            sub.setPlanType(SubscriptionPlan.FREE);
            sub.setStatus(SubscriptionStatus.CANCELED);
            sub.setJobPostingLimit(1);
            sub.setAiFeaturesEnabled(false);
            companySubscriptionRepository.save(sub);
            log.info("Company subscription {} downgraded to FREE after deletion.", sub.getId());
        });

        candidateSubscriptionRepository.findByStripeSubscriptionId(subscriptionId).ifPresent(sub -> {
            sub.setPlanType(CandidatePlan.FREE);
            sub.setStatus(SubscriptionStatus.CANCELED);
            sub.setMaxResumes(2);
            sub.setAiResumeOptimizerEnabled(false);
            sub.setSpotlightBadgeEnabled(false);
            candidateSubscriptionRepository.save(sub);
            log.info("Candidate subscription {} downgraded to FREE after deletion.", sub.getId());
        });
    }

    private void handleInvoicePaymentSucceeded(Invoice invoice) {
        log.info("Invoice payment succeeded: {}", invoice.getId());
    }

    private void handleInvoicePaymentFailed(Invoice invoice) {
        log.warn("Invoice payment failed: {}", invoice.getId());
        String subscriptionId = invoice.getSubscription();
        if (subscriptionId != null) {
            companySubscriptionRepository.findByStripeSubscriptionId(subscriptionId).ifPresent(sub -> {
                sub.setStatus(SubscriptionStatus.PAST_DUE);
                companySubscriptionRepository.save(sub);
            });
            candidateSubscriptionRepository.findByStripeSubscriptionId(subscriptionId).ifPresent(sub -> {
                sub.setStatus(SubscriptionStatus.PAST_DUE);
                candidateSubscriptionRepository.save(sub);
            });
        }
    }
}

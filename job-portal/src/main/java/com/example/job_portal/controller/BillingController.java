package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.billing.CheckoutRequest;
import com.example.job_portal.dto.billing.CheckoutResponse;
import com.example.job_portal.dto.billing.PortalResponse;
import com.example.job_portal.dto.billing.SubscriptionStatusResponse;
import com.example.job_portal.entity.User;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.StripeService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class BillingController {

    private final StripeService stripeService;
    private final UserRepository userRepository;

    @PostMapping("/checkout/employer")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<CheckoutResponse>> createEmployerCheckout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckoutRequest request
    ) throws StripeException {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));
        CheckoutResponse response = stripeService.createEmployerCheckout(user, request.getPriceId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/checkout/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CheckoutResponse>> createCandidateCheckout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckoutRequest request
    ) throws StripeException {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));
        CheckoutResponse response = stripeService.createCandidateCheckout(user, request.getPriceId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/portal")
    public ResponseEntity<ApiResponse<PortalResponse>> createCustomerPortal(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String returnUrl
    ) throws StripeException {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));
        PortalResponse response = stripeService.createCustomerPortal(user, returnUrl);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/subscription")
    public ResponseEntity<ApiResponse<SubscriptionStatusResponse>> getSubscriptionStatus(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));
        SubscriptionStatusResponse response = stripeService.getSubscriptionStatus(user);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader
    ) {
        if (sigHeader == null || sigHeader.isBlank()) {
            return ResponseEntity.badRequest().body("Missing Stripe-Signature header");
        }
        try {
            stripeService.handleWebhook(payload, sigHeader);
            return ResponseEntity.ok("Webhook received successfully");
        } catch (IllegalArgumentException e) {
            log.error("Stripe signature validation failed: {}", e.getMessage());
            return ResponseEntity.status(400).body("Invalid signature: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error processing Stripe webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error processing webhook: " + e.getMessage());
        }
    }
}

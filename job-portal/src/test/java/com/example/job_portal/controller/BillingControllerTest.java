package com.example.job_portal.controller;

import com.example.job_portal.common.exception.GlobalExceptionHandler;
import com.example.job_portal.dto.billing.CheckoutRequest;
import com.example.job_portal.dto.billing.CheckoutResponse;
import com.example.job_portal.dto.billing.PortalResponse;
import com.example.job_portal.dto.billing.SubscriptionStatusResponse;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.StripeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class BillingControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private StripeService stripeService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BillingController billingController;

    private UserPrincipal testPrincipal;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id("user-101")
                .name("Alex Recruiter")
                .email("recruiter@acme.com")
                .role(Role.EMPLOYER_ADMIN)
                .banned(false)
                .build();
        testPrincipal = UserPrincipal.create(testUser, "password");

        HandlerMethodArgumentResolver authPrincipalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
            }

            @Override
            public Object resolveArgument(MethodParameter parameter,
                                          ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest,
                                          WebDataBinderFactory binderFactory) {
                return testPrincipal;
            }
        };

        mockMvc = MockMvcBuilders
                .standaloneSetup(billingController)
                .setCustomArgumentResolvers(authPrincipalResolver)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/billing/checkout/employer - should create checkout session")
    void shouldCreateEmployerCheckout() throws Exception {
        when(userRepository.findById("user-101")).thenReturn(Optional.of(testUser));

        CheckoutResponse response = CheckoutResponse.builder()
                .checkoutUrl("https://checkout.stripe.com/c/pay/cs_test_123")
                .sessionId("cs_test_123")
                .build();

        when(stripeService.createEmployerCheckout(eq(testUser), eq("price_recruiter_growth_test"))).thenReturn(response);

        CheckoutRequest request = CheckoutRequest.builder()
                .priceId("price_recruiter_growth_test")
                .build();

        mockMvc.perform(post("/api/v1/billing/checkout/employer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.checkoutUrl", is("https://checkout.stripe.com/c/pay/cs_test_123")))
                .andExpect(jsonPath("$.data.sessionId", is("cs_test_123")));

        verify(stripeService, times(1)).createEmployerCheckout(testUser, "price_recruiter_growth_test");
    }

    @Test
    @DisplayName("POST /api/v1/billing/checkout/candidate - should create candidate checkout session")
    void shouldCreateCandidateCheckout() throws Exception {
        User candidate = User.builder()
                .id("user-101")
                .name("Jane Candidate")
                .email("candidate@example.com")
                .role(Role.CANDIDATE)
                .banned(false)
                .build();

        when(userRepository.findById("user-101")).thenReturn(Optional.of(candidate));

        CheckoutResponse response = CheckoutResponse.builder()
                .checkoutUrl("https://checkout.stripe.com/c/pay/cs_cand_456")
                .sessionId("cs_cand_456")
                .build();

        when(stripeService.createCandidateCheckout(eq(candidate), eq("price_candidate_pro_test"))).thenReturn(response);

        CheckoutRequest request = CheckoutRequest.builder()
                .priceId("price_candidate_pro_test")
                .build();

        mockMvc.perform(post("/api/v1/billing/checkout/candidate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.sessionId", is("cs_cand_456")));

        verify(stripeService, times(1)).createCandidateCheckout(candidate, "price_candidate_pro_test");
    }

    @Test
    @DisplayName("POST /api/v1/billing/portal - should return customer portal session")
    void shouldCreateCustomerPortal() throws Exception {
        when(userRepository.findById("user-101")).thenReturn(Optional.of(testUser));

        PortalResponse response = PortalResponse.builder()
                .portalUrl("https://billing.stripe.com/p/session/portal_123")
                .build();

        when(stripeService.createCustomerPortal(eq(testUser), eq("https://app.com/dashboard"))).thenReturn(response);

        mockMvc.perform(post("/api/v1/billing/portal")
                        .param("returnUrl", "https://app.com/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.portalUrl", is("https://billing.stripe.com/p/session/portal_123")));

        verify(stripeService, times(1)).createCustomerPortal(testUser, "https://app.com/dashboard");
    }

    @Test
    @DisplayName("GET /api/v1/billing/subscription - should return active subscription status")
    void shouldGetSubscriptionStatus() throws Exception {
        when(userRepository.findById("user-101")).thenReturn(Optional.of(testUser));

        SubscriptionStatusResponse statusResponse = SubscriptionStatusResponse.builder()
                .planType("GROWTH")
                .status("ACTIVE")
                .isPaid(true)
                .cancelAtPeriodEnd(false)
                .jobPostingLimit(10)
                .aiFeaturesEnabled(true)
                .build();

        when(stripeService.getSubscriptionStatus(testUser)).thenReturn(statusResponse);

        mockMvc.perform(get("/api/v1/billing/subscription"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.planType", is("GROWTH")))
                .andExpect(jsonPath("$.data.isPaid", is(true)))
                .andExpect(jsonPath("$.data.aiFeaturesEnabled", is(true)));

        verify(stripeService, times(1)).getSubscriptionStatus(testUser);
    }

    @Test
    @DisplayName("POST /api/v1/billing/webhook - should fail without Stripe-Signature header")
    void shouldRejectWebhookWithoutSignature() throws Exception {
        mockMvc.perform(post("/api/v1/billing/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"evt_123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Missing Stripe-Signature header"));

        verify(stripeService, never()).handleWebhook(any(), any());
    }

    @Test
    @DisplayName("POST /api/v1/billing/webhook - should process webhook with signature")
    void shouldProcessWebhookWithSignature() throws Exception {
        doNothing().when(stripeService).handleWebhook("{\"id\":\"evt_123\"}", "sig_valid_123");

        mockMvc.perform(post("/api/v1/billing/webhook")
                        .header("Stripe-Signature", "sig_valid_123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"evt_123\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Webhook received successfully"));

        verify(stripeService, times(1)).handleWebhook("{\"id\":\"evt_123\"}", "sig_valid_123");
    }
}

package com.example.job_portal.controller;

import com.example.job_portal.common.exception.GlobalExceptionHandler;
import com.example.job_portal.dto.auth.*;
import com.example.job_portal.entity.Role;
import com.example.job_portal.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AuthService authService;

    @Mock
    private com.example.job_portal.service.OtpService otpService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/auth/register/candidate - should return 201 with AuthResponse")
    void shouldRegisterCandidate() throws Exception {
        RegisterCandidateRequest request = RegisterCandidateRequest.builder()
                .name("Alex Smith")
                .email("alex@example.com")
                .password("supersecret123")
                .phone("+1234567890")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id("uuid-1234")
                .name("Alex Smith")
                .email("alex@example.com")
                .role(Role.CANDIDATE)
                .createdAt(Instant.now())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .expiresIn(900000)
                .user(userResponse)
                .build();

        when(authService.registerCandidate(any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register/candidate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Candidate registered successfully")))
                .andExpect(jsonPath("$.data.accessToken", is("mock-access-token")))
                .andExpect(jsonPath("$.data.user.role", is("CANDIDATE")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register/employer - should return 201 with Company and Employer User")
    void shouldRegisterEmployer() throws Exception {
        RegisterEmployerRequest request = RegisterEmployerRequest.builder()
                .name("Elena Rostova")
                .email("elena@acme.inc")
                .password("enterprisePass99")
                .companyName("Acme Corporation")
                .companyWebsite("https://acme.inc")
                .industry("FinTech")
                .build();

        CompanyResponse companyResponse = CompanyResponse.builder()
                .id("company-uuid-1")
                .name("Acme Corporation")
                .slug("acme-corporation")
                .industry("FinTech")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id("user-uuid-1")
                .name("Elena Rostova")
                .email("elena@acme.inc")
                .role(Role.EMPLOYER_ADMIN)
                .company(companyResponse)
                .createdAt(Instant.now())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken("mock-employer-token")
                .refreshToken("mock-employer-refresh")
                .expiresIn(900000)
                .user(userResponse)
                .build();

        when(authService.registerEmployer(any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register/employer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.user.role", is("EMPLOYER_ADMIN")))
                .andExpect(jsonPath("$.data.user.company.name", is("Acme Corporation")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/otp/send - should return 200 with success message")
    void shouldSendOtp() throws Exception {
        SendOtpRequest request = SendOtpRequest.builder()
                .email("alex@example.com")
                .build();

        mockMvc.perform(post("/api/v1/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Verification code sent to your email")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/otp/verify - should return 200 with success message")
    void shouldVerifyOtp() throws Exception {
        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .email("alex@example.com")
                .otp("123456")
                .build();

        mockMvc.perform(post("/api/v1/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Email verified successfully")));
    }
}

package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.auth.*;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.example.job_portal.service.OtpService otpService;

    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {
        otpService.sendEmailVerificationOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.message("Verification code sent to your email"));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        otpService.verifyEmailOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.message("Email verified successfully"));
    }

    @PostMapping("/otp/resend")
    public ResponseEntity<ApiResponse<Void>> resendOtp(
            @Valid @RequestBody SendOtpRequest request) {
        otpService.resendOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.message("New verification code sent to your email"));
    }

    @PostMapping("/register/candidate")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCandidate(
            @Valid @RequestBody RegisterCandidateRequest request) {
        AuthResponse response = authService.registerCandidate(request);
        return new ResponseEntity<>(
                ApiResponse.success("Candidate registered successfully", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/register/employer")
    public ResponseEntity<ApiResponse<AuthResponse>> registerEmployer(
            @Valid @RequestBody RegisterEmployerRequest request) {
        AuthResponse response = authService.registerEmployer(request);
        return new ResponseEntity<>(
                ApiResponse.success("Employer and company registered successfully", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");

        AuthResponse response = authService.login(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = authService.getCurrentUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestBody(required = false) RefreshTokenRequest request) {
        if (request != null && request.getRefreshToken() != null) {
            authService.logout(request.getRefreshToken());
        }
        return ResponseEntity.ok(ApiResponse.message("Logged out successfully"));
    }
}

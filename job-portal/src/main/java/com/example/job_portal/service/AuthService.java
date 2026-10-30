package com.example.job_portal.service;

import com.example.job_portal.dto.auth.*;

public interface AuthService {

    AuthResponse registerCandidate(RegisterCandidateRequest request);

    AuthResponse registerEmployer(RegisterEmployerRequest request);

    AuthResponse login(LoginRequest request, String ipAddress, String userAgent);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserResponse getCurrentUser(String userId);

    void logout(String sessionToken);
}

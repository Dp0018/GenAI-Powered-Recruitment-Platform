package com.example.job_portal.service;

import com.example.job_portal.common.exception.DuplicateResourceException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.exception.UnauthorizedException;
import com.example.job_portal.dto.auth.*;
import com.example.job_portal.entity.*;
import com.example.job_portal.mapper.UserMapper;
import com.example.job_portal.repository.AccountRepository;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.SessionRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final SessionRepository sessionRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Value("${app.jwt.refresh-token-expiration-days:7}")
    private int refreshTokenExpirationDays;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Override
    @Transactional
    public AuthResponse registerCandidate(RegisterCandidateRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("User", "email", normalizedEmail);
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .role(Role.CANDIDATE)
                .phone(request.getPhone())
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        Account credentialAccount = Account.builder()
                .user(savedUser)
                .providerId("credential")
                .accountId(savedUser.getId())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        accountRepository.save(credentialAccount);

        String accessToken = jwtService.generateAccessToken(savedUser);
        Session session = createSession(savedUser, null, null);

        log.info("Candidate registered successfully: {}", savedUser.getEmail());

        return AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken(accessToken)
                .refreshToken(session.getToken())
                .expiresIn(jwtService.getAccessTokenExpirationMs())
                .user(userMapper.toUserResponse(savedUser))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse registerEmployer(RegisterEmployerRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("User", "email", normalizedEmail);
        }

        String companySlug = generateUniqueSlug(request.getCompanyName());

        Company company = Company.builder()
                .name(request.getCompanyName().trim())
                .slug(companySlug)
                .website(request.getCompanyWebsite())
                .industry(request.getIndustry())
                .companySize(request.getCompanySize())
                .location(request.getLocation())
                .verificationStatus(Company.VerificationStatus.PENDING)
                .build();

        Company savedCompany = companyRepository.save(company);

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .role(Role.EMPLOYER_ADMIN)
                .phone(request.getPhone())
                .company(savedCompany)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        Account credentialAccount = Account.builder()
                .user(savedUser)
                .providerId("credential")
                .accountId(savedUser.getId())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        accountRepository.save(credentialAccount);

        String accessToken = jwtService.generateAccessToken(savedUser);
        Session session = createSession(savedUser, null, null);

        log.info("Employer and Vendor company registered: {} ({})", savedCompany.getName(), savedUser.getEmail());

        return AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken(accessToken)
                .refreshToken(session.getToken())
                .expiresIn(jwtService.getAccessTokenExpirationMs())
                .user(userMapper.toUserResponse(savedUser))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmailWithCompany(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.isBanned()) {
            String reason = user.getBanReason() != null ? user.getBanReason() : "Account suspended";
            throw new ForbiddenException("Your account has been banned. Reason: " + reason);
        }

        String accessToken = jwtService.generateAccessToken(user);
        Session session = createSession(user, ipAddress, userAgent);

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken(accessToken)
                .refreshToken(session.getToken())
                .expiresIn(jwtService.getAccessTokenExpirationMs())
                .user(userMapper.toUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        Session session = sessionRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid or non-existent refresh token"));

        if (session.isExpired()) {
            sessionRepository.delete(session);
            throw new UnauthorizedException("Refresh token has expired. Please sign in again.");
        }

        User user = session.getUser();
        if (user.isBanned()) {
            throw new ForbiddenException("Account has been banned");
        }

        // Token rotation: update session token & extend expiry
        String newSessionToken = UUID.randomUUID().toString();
        session.setToken(newSessionToken);
        session.setExpiresAt(Instant.now().plus(refreshTokenExpirationDays, ChronoUnit.DAYS));
        sessionRepository.save(session);

        String newAccessToken = jwtService.generateAccessToken(user);

        return AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken(newAccessToken)
                .refreshToken(newSessionToken)
                .expiresIn(jwtService.getAccessTokenExpirationMs())
                .user(userMapper.toUserResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public void logout(String sessionToken) {
        if (sessionToken != null) {
            sessionRepository.findByToken(sessionToken)
                    .ifPresent(sessionRepository::delete);
        }
    }

    private Session createSession(User user, String ipAddress, String userAgent) {
        Session session = Session.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .expiresAt(Instant.now().plus(refreshTokenExpirationDays, ChronoUnit.DAYS))
                .build();

        return sessionRepository.save(session);
    }

    private String generateUniqueSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input.trim().toLowerCase(Locale.ROOT)).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");

        if (!companyRepository.existsBySlug(slug)) {
            return slug;
        }

        return slug + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}

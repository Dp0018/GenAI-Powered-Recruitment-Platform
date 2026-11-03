package com.example.job_portal.config;

import com.example.job_portal.entity.Account;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.AccountRepository;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email:admin@jobportal.com}")
    private String adminEmail;

    @Value("${app.admin.default-password:AdminPassword123!}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Platform Admin
        if (userRepository.findByEmail(adminEmail.toLowerCase()).isEmpty()) {
            User admin = User.builder()
                    .name("Platform Administrator")
                    .email(adminEmail.toLowerCase())
                    .role(Role.PLATFORM_ADMIN)
                    .emailVerified(true)
                    .banned(false)
                    .build();

            User savedAdmin = userRepository.save(admin);

            Account account = Account.builder()
                    .user(savedAdmin)
                    .providerId("credential")
                    .accountId(savedAdmin.getId())
                    .password(passwordEncoder.encode(adminPassword))
                    .build();

            accountRepository.save(account);

            log.info("Default platform administrator created: '{}' with role PLATFORM_ADMIN", adminEmail);
        }

        // 2. Ensure Recruiter account has credentials
        userRepository.findByEmail("recruiter@techcorp.io").ifPresent(recruiter -> {
            if (accountRepository.findByUserIdAndProviderId(recruiter.getId(), "credential").isEmpty()) {
                Account account = Account.builder()
                        .user(recruiter)
                        .providerId("credential")
                        .accountId(recruiter.getId())
                        .password(passwordEncoder.encode("Password123!"))
                        .build();
                accountRepository.save(account);
                log.info("Default password set for recruiter@techcorp.io");
            }
        });

        // 3. Ensure Candidate account has credentials
        if (userRepository.findByEmail("candidate@jobportal.com").isEmpty()) {
            User candidate = User.builder()
                    .name("Demo Candidate")
                    .email("candidate@jobportal.com")
                    .role(Role.CANDIDATE)
                    .emailVerified(true)
                    .banned(false)
                    .build();

            User savedCandidate = userRepository.save(candidate);

            Account account = Account.builder()
                    .user(savedCandidate)
                    .providerId("credential")
                    .accountId(savedCandidate.getId())
                    .password(passwordEncoder.encode("Password123!"))
                    .build();

            accountRepository.save(account);
            log.info("Default candidate account created: candidate@jobportal.com");
        }
    }
}

package com.example.job_portal.config;

import com.example.job_portal.entity.Account;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.AccountRepository;
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
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email:admin@jobportal.com}")
    private String adminEmail;

    @Value("${app.admin.default-password:AdminPassword123!}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
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
    }
}

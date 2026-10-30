package com.example.job_portal.security;

import com.example.job_portal.entity.Account;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.AccountRepository;
import com.example.job_portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailWithCompany(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Account credentialAccount = accountRepository.findByUserIdAndProviderId(user.getId(), "credential")
                .orElse(null);

        String password = credentialAccount != null ? credentialAccount.getPassword() : "";

        return UserPrincipal.create(user, password);
    }
}

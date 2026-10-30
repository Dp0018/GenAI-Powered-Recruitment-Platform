package com.example.job_portal.repository;

import com.example.job_portal.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    Optional<Account> findByUserIdAndProviderId(String userId, String providerId);

    Optional<Account> findByProviderIdAndAccountId(String providerId, String accountId);
}

package com.example.job_portal.repository;

import com.example.job_portal.entity.CompanySubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanySubscriptionRepository extends JpaRepository<CompanySubscription, String> {
    Optional<CompanySubscription> findByCompanyId(String companyId);
    Optional<CompanySubscription> findByStripeCustomerId(String stripeCustomerId);
    Optional<CompanySubscription> findByStripeSubscriptionId(String stripeSubscriptionId);
}

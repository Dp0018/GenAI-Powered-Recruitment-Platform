package com.example.job_portal.repository;

import com.example.job_portal.entity.CandidateSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateSubscriptionRepository extends JpaRepository<CandidateSubscription, String> {
    Optional<CandidateSubscription> findByUserId(String userId);
    Optional<CandidateSubscription> findByStripeCustomerId(String stripeCustomerId);
    Optional<CandidateSubscription> findByStripeSubscriptionId(String stripeSubscriptionId);
}

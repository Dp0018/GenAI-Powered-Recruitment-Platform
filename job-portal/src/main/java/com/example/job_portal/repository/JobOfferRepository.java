package com.example.job_portal.repository;

import com.example.job_portal.entity.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, String> {

    List<JobOffer> findByApplicationIdOrderByCreatedAtDesc(String applicationId);

    Optional<JobOffer> findFirstByApplicationIdOrderByCreatedAtDesc(String applicationId);

    Optional<JobOffer> findBySignatureToken(String signatureToken);

    List<JobOffer> findByCompanyIdOrderByCreatedAtDesc(String companyId);

    List<JobOffer> findByCandidateIdOrderByCreatedAtDesc(String candidateId);
}

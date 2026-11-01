package com.example.job_portal.repository;

import com.example.job_portal.entity.CandidateResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateResumeRepository extends JpaRepository<CandidateResume, String> {

    List<CandidateResume> findByCandidateIdOrderByCreatedAtDesc(String candidateId);

    Optional<CandidateResume> findByIdAndCandidateId(String id, String candidateId);

    Optional<CandidateResume> findByCandidateIdAndIsDefaultTrue(String candidateId);

    long countByCandidateId(String candidateId);
}

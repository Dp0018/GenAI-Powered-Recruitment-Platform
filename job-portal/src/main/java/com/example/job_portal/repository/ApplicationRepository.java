package com.example.job_portal.repository;

import com.example.job_portal.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    boolean existsByJobIdAndCandidateId(String jobId, String candidateId);

    Optional<Application> findByJobIdAndCandidateId(String jobId, String candidateId);

    Page<Application> findByCandidateIdOrderByCreatedAtDesc(String candidateId, Pageable pageable);

    Page<Application> findByJobCompanyIdOrderByCreatedAtDesc(String companyId, Pageable pageable);

    Page<Application> findByJobCompanyIdAndJobIdOrderByCreatedAtDesc(String companyId, String jobId, Pageable pageable);

    long countByJobCompanyId(String companyId);

    long countByJobId(String jobId);
}

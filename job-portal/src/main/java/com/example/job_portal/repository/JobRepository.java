package com.example.job_portal.repository;

import com.example.job_portal.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, String>, JpaSpecificationExecutor<Job> {

    Optional<Job> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<Job> findAllByCompanyId(String companyId, Pageable pageable);

    Page<Job> findAllByCompanyIdAndStatus(String companyId, Job.JobStatus status, Pageable pageable);

    long countByCompanyId(String companyId);

    long countByCompanyIdAndStatus(String companyId, Job.JobStatus status);

    long countByStatus(Job.JobStatus status);
}

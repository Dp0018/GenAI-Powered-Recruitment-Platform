package com.example.job_portal.repository;

import com.example.job_portal.entity.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, String> {

    Optional<SavedJob> findByUserIdAndJobId(String userId, String jobId);

    boolean existsByUserIdAndJobId(String userId, String jobId);

    void deleteByUserIdAndJobId(String userId, String jobId);

    Page<SavedJob> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    long countByUserId(String userId);
}

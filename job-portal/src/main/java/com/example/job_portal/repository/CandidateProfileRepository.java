package com.example.job_portal.repository;

import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, String> {

    Optional<CandidateProfile> findByUserId(String userId);

    Optional<CandidateProfile> findByUser(User user);

    boolean existsByUserId(String userId);
}

package com.example.job_portal.repository;

import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.EducationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationHistoryRepository extends JpaRepository<EducationHistory, String> {

    List<EducationHistory> findByProfileOrderByCreatedAtDesc(CandidateProfile profile);

    void deleteByProfile(CandidateProfile profile);
}

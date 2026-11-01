package com.example.job_portal.repository;

import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, String> {

    List<WorkExperience> findByProfileOrderByCreatedAtDesc(CandidateProfile profile);

    void deleteByProfile(CandidateProfile profile);
}

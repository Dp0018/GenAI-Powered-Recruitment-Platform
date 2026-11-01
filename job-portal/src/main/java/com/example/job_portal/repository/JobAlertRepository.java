package com.example.job_portal.repository;

import com.example.job_portal.entity.JobAlert;
import com.example.job_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobAlertRepository extends JpaRepository<JobAlert, String> {

    List<JobAlert> findByCandidateOrderByCreatedAtDesc(User candidate);

    List<JobAlert> findByActiveTrue();
}

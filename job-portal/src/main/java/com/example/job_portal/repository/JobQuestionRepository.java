package com.example.job_portal.repository;

import com.example.job_portal.entity.JobQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobQuestionRepository extends JpaRepository<JobQuestion, String> {

    List<JobQuestion> findByJobIdOrderByOrderIndexAsc(String jobId);

    void deleteByJobId(String jobId);
}

package com.example.job_portal.repository;

import com.example.job_portal.entity.ApplicationAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationAnswerRepository extends JpaRepository<ApplicationAnswer, String> {

    List<ApplicationAnswer> findByApplicationId(String applicationId);

    void deleteByApplicationId(String applicationId);
}

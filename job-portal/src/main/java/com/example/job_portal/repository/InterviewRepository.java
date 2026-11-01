package com.example.job_portal.repository;

import com.example.job_portal.entity.Interview;
import com.example.job_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, String> {

    @Query("SELECT i FROM Interview i " +
           "JOIN FETCH i.application a " +
           "JOIN FETCH a.job j " +
           "JOIN FETCH j.company c " +
           "JOIN FETCH i.candidate u " +
           "WHERE i.candidate = :candidate " +
           "ORDER BY i.scheduledAt ASC")
    List<Interview> findByCandidateWithDetails(@Param("candidate") User candidate);

    @Query("SELECT i FROM Interview i " +
           "JOIN FETCH i.application a " +
           "JOIN FETCH a.job j " +
           "JOIN FETCH j.company c " +
           "JOIN FETCH i.candidate u " +
           "WHERE j.company.id = :companyId " +
           "ORDER BY i.scheduledAt ASC")
    List<Interview> findByCompanyIdWithDetails(@Param("companyId") String companyId);

    List<Interview> findByApplicationId(String applicationId);
}

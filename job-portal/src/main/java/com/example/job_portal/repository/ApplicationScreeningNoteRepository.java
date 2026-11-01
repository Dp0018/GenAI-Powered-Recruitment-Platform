package com.example.job_portal.repository;

import com.example.job_portal.entity.ApplicationScreeningNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationScreeningNoteRepository extends JpaRepository<ApplicationScreeningNote, String> {

    @Query("SELECT n FROM ApplicationScreeningNote n " +
           "JOIN FETCH n.author " +
           "WHERE n.application.id = :applicationId " +
           "ORDER BY n.createdAt DESC")
    List<ApplicationScreeningNote> findByApplicationIdWithAuthor(@Param("applicationId") String applicationId);

    @Query("SELECT AVG(n.rating) FROM ApplicationScreeningNote n WHERE n.application.id = :applicationId")
    Double calculateAverageRatingByApplicationId(@Param("applicationId") String applicationId);
}

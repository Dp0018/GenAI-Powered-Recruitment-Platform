package com.example.job_portal.repository;

import com.example.job_portal.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, String> {

    Optional<Verification> findByIdentifierAndValue(String identifier, String value);

    Optional<Verification> findByIdentifier(String identifier);

    @Modifying
    @Query("DELETE FROM Verification v WHERE v.identifier = :identifier")
    void deleteByIdentifier(@Param("identifier") String identifier);

    @Modifying
    @Query("DELETE FROM Verification v WHERE v.expiresAt < :now")
    void deleteExpiredVerifications(@Param("now") Instant now);
}

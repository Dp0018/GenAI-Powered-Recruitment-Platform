package com.example.job_portal.repository;

import com.example.job_portal.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {

    Optional<Company> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    Page<Company> findByVerificationStatus(Company.VerificationStatus status, Pageable pageable);

    Page<Company> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Company> findByVerificationStatusAndNameContainingIgnoreCase(
            Company.VerificationStatus status, String name, Pageable pageable);

    long countByVerificationStatus(Company.VerificationStatus status);
}


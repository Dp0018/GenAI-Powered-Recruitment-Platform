package com.example.job_portal.repository;

import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.company WHERE u.email = :email")
    Optional<User> findByEmailWithCompany(@Param("email") String email);

    List<User> findByRole(Role role);

    List<User> findByCompanyId(String companyId);

    org.springframework.data.domain.Page<User> findByRole(Role role, org.springframework.data.domain.Pageable pageable);

    org.springframework.data.domain.Page<User> findByBanned(boolean banned, org.springframework.data.domain.Pageable pageable);

    org.springframework.data.domain.Page<User> findByRoleAndBanned(Role role, boolean banned, org.springframework.data.domain.Pageable pageable);

    org.springframework.data.domain.Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String email, org.springframework.data.domain.Pageable pageable);

    long countByRole(Role role);

    long countByBanned(boolean banned);
}

package com.example.job_portal.service;

import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.admin.AdminAnalyticsResponse;
import com.example.job_portal.dto.admin.AdminUserResponse;
import com.example.job_portal.dto.admin.BanUserRequest;
import com.example.job_portal.dto.admin.RejectCompanyRequest;
import com.example.job_portal.dto.company.CompanyResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.countByRole(Role.CANDIDATE);
        long totalEmployers = userRepository.countByRole(Role.EMPLOYER_ADMIN) + userRepository.countByRole(Role.RECRUITER);
        long bannedUsers = userRepository.countByBanned(true);

        long totalCompanies = companyRepository.count();
        long pendingCompanies = companyRepository.countByVerificationStatus(Company.VerificationStatus.PENDING);
        long verifiedCompanies = companyRepository.countByVerificationStatus(Company.VerificationStatus.VERIFIED);
        long rejectedCompanies = companyRepository.countByVerificationStatus(Company.VerificationStatus.REJECTED);

        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(Job.JobStatus.PUBLISHED);
        long totalApplications = applicationRepository.count();

        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalCandidates(totalCandidates)
                .totalEmployers(totalEmployers)
                .bannedUsers(bannedUsers)
                .totalCompanies(totalCompanies)
                .pendingCompanies(pendingCompanies)
                .verifiedCompanies(verifiedCompanies)
                .rejectedCompanies(rejectedCompanies)
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .totalApplications(totalApplications)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CompanyResponse> getCompanies(Company.VerificationStatus status, String search, Pageable pageable) {
        Page<Company> page;

        boolean hasStatus = status != null;
        boolean hasSearch = StringUtils.hasText(search);

        if (hasStatus && hasSearch) {
            page = companyRepository.findByVerificationStatusAndNameContainingIgnoreCase(status, search.trim(), pageable);
        } else if (hasStatus) {
            page = companyRepository.findByVerificationStatus(status, pageable);
        } else if (hasSearch) {
            page = companyRepository.findByNameContainingIgnoreCase(search.trim(), pageable);
        } else {
            page = companyRepository.findAll(pageable);
        }

        Page<CompanyResponse> dtoPage = page.map(company -> {
            long activeCount = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.PUBLISHED);
            return CompanyResponse.fromEntity(company, activeCount);
        });

        return PagedResponse.from(dtoPage);
    }

    @Override
    @Transactional
    public CompanyResponse verifyCompany(String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        company.setVerificationStatus(Company.VerificationStatus.VERIFIED);
        company.setVerifiedAt(Instant.now());
        Company saved = companyRepository.save(company);

        log.info("Company '{}' [ID: {}] officially verified by administrator", saved.getName(), saved.getId());

        // Notify company employer members
        List<User> members = userRepository.findByCompanyId(companyId);
        for (User member : members) {
            emailService.sendCompanyVerificationEmail(
                    member.getEmail(),
                    member.getName(),
                    saved.getName(),
                    true,
                    "Your organization credentials have been validated."
            );
        }

        long activeCount = jobRepository.countByCompanyIdAndStatus(saved.getId(), Job.JobStatus.PUBLISHED);
        return CompanyResponse.fromEntity(saved, activeCount);
    }

    @Override
    @Transactional
    public CompanyResponse rejectCompany(String companyId, RejectCompanyRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        company.setVerificationStatus(Company.VerificationStatus.REJECTED);
        Company saved = companyRepository.save(company);

        String reason = (request != null && StringUtils.hasText(request.getReason()))
                ? request.getReason().trim()
                : "Documentation or business domain did not meet platform compliance standards.";

        log.info("Company '{}' [ID: {}] rejected by administrator. Reason: {}", saved.getName(), saved.getId(), reason);

        List<User> members = userRepository.findByCompanyId(companyId);
        for (User member : members) {
            emailService.sendCompanyVerificationEmail(
                    member.getEmail(),
                    member.getName(),
                    saved.getName(),
                    false,
                    reason
            );
        }

        long activeCount = jobRepository.countByCompanyIdAndStatus(saved.getId(), Job.JobStatus.PUBLISHED);
        return CompanyResponse.fromEntity(saved, activeCount);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminUserResponse> getUsers(Role role, Boolean banned, String search, Pageable pageable) {
        Page<User> page;

        boolean hasRole = role != null;
        boolean hasBanned = banned != null;
        boolean hasSearch = StringUtils.hasText(search);

        if (hasRole && hasBanned) {
            page = userRepository.findByRoleAndBanned(role, banned, pageable);
        } else if (hasRole) {
            page = userRepository.findByRole(role, pageable);
        } else if (hasBanned) {
            page = userRepository.findByBanned(banned, pageable);
        } else if (hasSearch) {
            page = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search.trim(), search.trim(), pageable);
        } else {
            page = userRepository.findAll(pageable);
        }

        Page<AdminUserResponse> dtoPage = page.map(AdminUserResponse::fromEntity);
        return PagedResponse.from(dtoPage);
    }

    @Override
    @Transactional
    public AdminUserResponse banUser(String userId, BanUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setBanned(true);
        user.setBanReason(request.getReason().trim());

        if (request.getDurationDays() != null && request.getDurationDays() > 0) {
            user.setBanExpires(Instant.now().plus(request.getDurationDays(), ChronoUnit.DAYS));
        } else {
            user.setBanExpires(null); // permanent ban until manual unban
        }

        User saved = userRepository.save(user);
        log.warn("User '{}' [ID: {}] has been BANNED by platform administrator. Reason: {}",
                saved.getEmail(), saved.getId(), request.getReason());

        return AdminUserResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public AdminUserResponse unbanUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setBanned(false);
        user.setBanReason(null);
        user.setBanExpires(null);

        User saved = userRepository.save(user);
        log.info("User '{}' [ID: {}] has been UNBANNED by platform administrator", saved.getEmail(), saved.getId());

        return AdminUserResponse.fromEntity(saved);
    }
}

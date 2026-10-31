package com.example.job_portal.service;

import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.admin.AdminAnalyticsResponse;
import com.example.job_portal.dto.admin.AdminUserResponse;
import com.example.job_portal.dto.admin.BanUserRequest;
import com.example.job_portal.dto.admin.RejectCompanyRequest;
import com.example.job_portal.dto.company.CompanyResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Role;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    AdminAnalyticsResponse getAnalytics();

    PagedResponse<CompanyResponse> getCompanies(Company.VerificationStatus status, String search, Pageable pageable);

    CompanyResponse verifyCompany(String companyId);

    CompanyResponse rejectCompany(String companyId, RejectCompanyRequest request);

    PagedResponse<AdminUserResponse> getUsers(Role role, Boolean banned, String search, Pageable pageable);

    AdminUserResponse banUser(String userId, BanUserRequest request);

    AdminUserResponse unbanUser(String userId);
}

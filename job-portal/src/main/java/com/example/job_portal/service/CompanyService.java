package com.example.job_portal.service;

import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.company.CompanyResponse;
import com.example.job_portal.dto.company.PublicCompanyDetailResponse;
import com.example.job_portal.dto.company.UpdateCompanyRequest;
import com.example.job_portal.security.UserPrincipal;
import org.springframework.data.domain.Pageable;

public interface CompanyService {

    PublicCompanyDetailResponse getPublicCompanyBySlug(String slug);

    PagedResponse<CompanyResponse> getPublicCompanies(String query, Pageable pageable);

    CompanyResponse getMyCompany(UserPrincipal currentUser);

    CompanyResponse updateMyCompany(UserPrincipal currentUser, UpdateCompanyRequest request);
}

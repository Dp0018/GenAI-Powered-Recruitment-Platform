package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.company.CompanyResponse;
import com.example.job_portal.dto.company.UpdateCompanyRequest;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/my-company")
    @PreAuthorize("hasAnyRole('EMPLOYER_ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse<CompanyResponse>> getMyCompany(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CompanyResponse response = companyService.getMyCompany(currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/my-company")
    @PreAuthorize("hasRole('EMPLOYER_ADMIN')")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateMyCompany(
            @Valid @RequestBody UpdateCompanyRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CompanyResponse response = companyService.updateMyCompany(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Company profile updated successfully", response));
    }
}

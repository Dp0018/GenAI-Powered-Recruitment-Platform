package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.admin.AdminAnalyticsResponse;
import com.example.job_portal.dto.admin.AdminUserResponse;
import com.example.job_portal.dto.admin.BanUserRequest;
import com.example.job_portal.dto.admin.RejectCompanyRequest;
import com.example.job_portal.dto.company.CompanyResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Role;
import com.example.job_portal.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('PLATFORM_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getAnalytics() {
        AdminAnalyticsResponse response = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Admin analytics retrieved successfully", response));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<PagedResponse<CompanyResponse>>> getCompanies(
            @RequestParam(required = false) Company.VerificationStatus status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<CompanyResponse> response = adminService.getCompanies(status, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/companies/{companyId}/verify")
    public ResponseEntity<ApiResponse<CompanyResponse>> verifyCompany(@PathVariable String companyId) {
        CompanyResponse response = adminService.verifyCompany(companyId);
        return ResponseEntity.ok(ApiResponse.success("Company verified successfully", response));
    }

    @PutMapping("/companies/{companyId}/reject")
    public ResponseEntity<ApiResponse<CompanyResponse>> rejectCompany(
            @PathVariable String companyId,
            @RequestBody(required = false) RejectCompanyRequest request
    ) {
        CompanyResponse response = adminService.rejectCompany(companyId, request);
        return ResponseEntity.ok(ApiResponse.success("Company verification rejected", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<AdminUserResponse>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean banned,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<AdminUserResponse> response = adminService.getUsers(role, banned, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<ApiResponse<AdminUserResponse>> banUser(
            @PathVariable String userId,
            @Valid @RequestBody BanUserRequest request
    ) {
        AdminUserResponse response = adminService.banUser(userId, request);
        return ResponseEntity.ok(ApiResponse.success("User has been banned", response));
    }

    @PutMapping("/users/{userId}/unban")
    public ResponseEntity<ApiResponse<AdminUserResponse>> unbanUser(@PathVariable String userId) {
        AdminUserResponse response = adminService.unbanUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User has been unbanned", response));
    }
}

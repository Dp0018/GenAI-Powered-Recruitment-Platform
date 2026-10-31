package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.company.CompanyResponse;
import com.example.job_portal.dto.company.PublicCompanyDetailResponse;
import com.example.job_portal.service.CompanyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/public/companies")
@RequiredArgsConstructor
public class PublicCompanyController {

    private final CompanyService companyService;

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PublicCompanyDetailResponse>> getPublicCompanyBySlug(
            @PathVariable String slug
    ) {
        PublicCompanyDetailResponse response = companyService.getPublicCompanyBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CompanyResponse>>> getPublicCompanies(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(50, Math.max(1, size)));
        PagedResponse<CompanyResponse> response = companyService.getPublicCompanies(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

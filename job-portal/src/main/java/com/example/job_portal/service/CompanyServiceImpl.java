package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.company.CompanyResponse;
import com.example.job_portal.dto.company.PublicCompanyDetailResponse;
import com.example.job_portal.dto.company.UpdateCompanyRequest;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Job;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional(readOnly = true)
    public PublicCompanyDetailResponse getPublicCompanyBySlug(String slug) {
        Company company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "slug", slug));

        long activeJobsCount = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.PUBLISHED);

        // Fetch up to 50 active published jobs for this company
        Page<Job> publishedJobsPage = jobRepository.findAllByCompanyIdAndStatus(
                company.getId(),
                Job.JobStatus.PUBLISHED,
                PageRequest.of(0, 50)
        );

        List<JobResponse> openJobs = publishedJobsPage.getContent().stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());

        CompanyResponse companyResponse = CompanyResponse.fromEntity(company, activeJobsCount);

        return PublicCompanyDetailResponse.builder()
                .company(companyResponse)
                .openJobs(openJobs)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CompanyResponse> getPublicCompanies(String query, Pageable pageable) {
        Page<Company> companiesPage = companyRepository.findAll(pageable);

        Page<CompanyResponse> dtoPage = companiesPage.map(c -> {
            long activeJobs = jobRepository.countByCompanyIdAndStatus(c.getId(), Job.JobStatus.PUBLISHED);
            return CompanyResponse.fromEntity(c, activeJobs);
        });

        return PagedResponse.from(dtoPage);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getMyCompany(UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to any company");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        long activeJobsCount = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.JobStatus.PUBLISHED);
        return CompanyResponse.fromEntity(company, activeJobsCount);
    }

    @Override
    @Transactional
    public CompanyResponse updateMyCompany(UserPrincipal currentUser, UpdateCompanyRequest request) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to any company");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        if (StringUtils.hasText(request.getName())) {
            company.setName(request.getName().trim());
        }
        if (request.getWebsite() != null) {
            company.setWebsite(request.getWebsite().trim());
        }
        if (request.getIndustry() != null) {
            company.setIndustry(request.getIndustry().trim());
        }
        if (request.getCompanySize() != null) {
            company.setCompanySize(request.getCompanySize().trim());
        }
        if (request.getLocation() != null) {
            company.setLocation(request.getLocation().trim());
        }
        if (request.getDescription() != null) {
            company.setDescription(request.getDescription().trim());
        }
        if (request.getLogoUrl() != null) {
            company.setLogoUrl(request.getLogoUrl().trim());
        }
        if (request.getBannerUrl() != null) {
            company.setBannerUrl(request.getBannerUrl().trim());
        }

        Company savedCompany = companyRepository.save(company);
        long activeJobsCount = jobRepository.countByCompanyIdAndStatus(savedCompany.getId(), Job.JobStatus.PUBLISHED);

        log.info("Company profile updated for '{}' [{}] by member '{}'",
                savedCompany.getName(), savedCompany.getId(), currentUser.getEmail());

        return CompanyResponse.fromEntity(savedCompany, activeJobsCount);
    }
}

package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.dto.job.CreateJobRequest;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.Role;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private JobService jobService;

    private Company company;
    private UserPrincipal employerPrincipal;
    private Job existingJob;

    @BeforeEach
    void setUp() {
        company = Company.builder()
                .id("company-acme")
                .name("Acme Corp")
                .slug("acme-corp")
                .build();

        employerPrincipal = UserPrincipal.builder()
                .id("user-employer-1")
                .email("admin@acme.com")
                .role(Role.EMPLOYER_ADMIN)
                .companyId("company-acme")
                .build();

        existingJob = Job.builder()
                .id("job-100")
                .title("Senior Backend Engineer")
                .slug("senior-backend-engineer-acme-corp")
                .company(company)
                .status(Job.JobStatus.PUBLISHED)
                .workplaceType(Job.WorkplaceType.REMOTE)
                .jobType(Job.JobType.FULL_TIME)
                .experienceLevel(Job.ExperienceLevel.SENIOR)
                .minSalary(160000)
                .maxSalary(210000)
                .benefits(List.of("HEALTH_INSURANCE", "UNLIMITED_PTO"))
                .build();
    }

    @Test
    @DisplayName("Should create job requisition with benefits and expiration days")
    void createJob_Success() {
        CreateJobRequest request = CreateJobRequest.builder()
                .title("Staff Cloud Engineer")
                .description("Build globally distributed cloud primitives.")
                .requirements("Kubernetes, Go, AWS")
                .location("Remote")
                .workplaceType("REMOTE")
                .jobType("FULL_TIME")
                .experienceLevel("SENIOR")
                .minSalary(180000)
                .maxSalary(240000)
                .benefits(List.of("HEALTH_INSURANCE", "EQUITY", "REMOTE_STIPEND"))
                .expirationDays(60)
                .build();

        when(companyRepository.findById("company-acme")).thenReturn(Optional.of(company));
        when(jobRepository.existsBySlug(any())).thenReturn(false);
        when(jobRepository.save(any(Job.class))).thenAnswer(inv -> {
            Job j = inv.getArgument(0);
            j.setId("new-job-id");
            return j;
        });

        JobResponse response = jobService.createJob(request, employerPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Staff Cloud Engineer");
        assertThat(response.getBenefits()).contains("HEALTH_INSURANCE", "EQUITY", "REMOTE_STIPEND");
        assertThat(response.getExpiresAt()).isNotNull();
        assertThat(response.isExpired()).isFalse();
    }

    @Test
    @DisplayName("Should toggle job status via 1-click updateJobStatus")
    void updateJobStatus_Success() {
        when(jobRepository.findById("job-100")).thenReturn(Optional.of(existingJob));
        when(jobRepository.save(any(Job.class))).thenAnswer(inv -> inv.getArgument(0));

        JobResponse response = jobService.updateJobStatus("job-100", "CLOSED", employerPrincipal);

        assertThat(response.getStatus()).isEqualTo("CLOSED");
        assertThat(existingJob.getStatus()).isEqualTo(Job.JobStatus.CLOSED);
        verify(jobRepository, times(1)).save(existingJob);
    }

    @Test
    @DisplayName("Should reject invalid status string with BadRequestException")
    void updateJobStatus_InvalidStatus_ThrowsBadRequest() {
        when(jobRepository.findById("job-100")).thenReturn(Optional.of(existingJob));

        assertThatThrownBy(() -> jobService.updateJobStatus("job-100", "INVALID_STATUS", employerPrincipal))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid job status");
    }

    @Test
    @DisplayName("Tenant isolation: updating requisition of another company throws ForbiddenException")
    void updateJobStatus_CrossTenant_ThrowsForbidden() {
        UserPrincipal otherTenantPrincipal = UserPrincipal.builder()
                .id("other-user")
                .email("other@other.com")
                .companyId("different-company-id")
                .build();

        when(jobRepository.findById("job-100")).thenReturn(Optional.of(existingJob));

        assertThatThrownBy(() -> jobService.updateJobStatus("job-100", "CLOSED", otherTenantPrincipal))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Access denied");
    }
}

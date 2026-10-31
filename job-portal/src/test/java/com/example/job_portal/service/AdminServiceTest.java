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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AdminServiceImpl adminService;

    private Company testCompany;
    private User testEmployer;
    private User testCandidate;

    @BeforeEach
    void setUp() {
        testCompany = Company.builder()
                .id("company-1")
                .name("Acme Corp")
                .slug("acme-corp")
                .verificationStatus(Company.VerificationStatus.PENDING)
                .build();

        testEmployer = User.builder()
                .id("user-employer-1")
                .name("Employer Admin")
                .email("employer@acme.com")
                .role(Role.EMPLOYER_ADMIN)
                .company(testCompany)
                .banned(false)
                .build();

        testCandidate = User.builder()
                .id("user-cand-1")
                .name("Candidate One")
                .email("candidate@example.com")
                .role(Role.CANDIDATE)
                .banned(false)
                .build();
    }

    @Test
    @DisplayName("getAnalytics should aggregate KPI metrics from all repositories")
    void getAnalytics_shouldReturnAggregatedMetrics() {
        when(userRepository.count()).thenReturn(10L);
        when(userRepository.countByRole(Role.CANDIDATE)).thenReturn(7L);
        when(userRepository.countByRole(Role.EMPLOYER_ADMIN)).thenReturn(2L);
        when(userRepository.countByRole(Role.RECRUITER)).thenReturn(1L);
        when(userRepository.countByBanned(true)).thenReturn(1L);

        when(companyRepository.count()).thenReturn(5L);
        when(companyRepository.countByVerificationStatus(Company.VerificationStatus.PENDING)).thenReturn(2L);
        when(companyRepository.countByVerificationStatus(Company.VerificationStatus.VERIFIED)).thenReturn(2L);
        when(companyRepository.countByVerificationStatus(Company.VerificationStatus.REJECTED)).thenReturn(1L);

        when(jobRepository.count()).thenReturn(8L);
        when(jobRepository.countByStatus(Job.JobStatus.PUBLISHED)).thenReturn(6L);
        when(applicationRepository.count()).thenReturn(25L);

        AdminAnalyticsResponse response = adminService.getAnalytics();

        assertThat(response.getTotalUsers()).isEqualTo(10L);
        assertThat(response.getTotalCandidates()).isEqualTo(7L);
        assertThat(response.getTotalEmployers()).isEqualTo(3L);
        assertThat(response.getBannedUsers()).isEqualTo(1L);
        assertThat(response.getTotalCompanies()).isEqualTo(5L);
        assertThat(response.getPendingCompanies()).isEqualTo(2L);
        assertThat(response.getActiveJobs()).isEqualTo(6L);
        assertThat(response.getTotalApplications()).isEqualTo(25L);
    }

    @Test
    @DisplayName("verifyCompany should update status to VERIFIED, notify members, and return company")
    void verifyCompany_shouldUpdateStatusAndNotify() {
        when(companyRepository.findById("company-1")).thenReturn(Optional.of(testCompany));
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findByCompanyId("company-1")).thenReturn(List.of(testEmployer));
        when(jobRepository.countByCompanyIdAndStatus("company-1", Job.JobStatus.PUBLISHED)).thenReturn(2L);

        CompanyResponse response = adminService.verifyCompany("company-1");

        assertThat(response.getVerificationStatus()).isEqualTo(Company.VerificationStatus.VERIFIED);
        assertThat(testCompany.getVerifiedAt()).isNotNull();
        verify(emailService).sendCompanyVerificationEmail(
                eq("employer@acme.com"),
                eq("Employer Admin"),
                eq("Acme Corp"),
                eq(true),
                anyString()
        );
    }

    @Test
    @DisplayName("rejectCompany should update status to REJECTED and notify employer with reason")
    void rejectCompany_shouldUpdateStatusToRejected() {
        when(companyRepository.findById("company-1")).thenReturn(Optional.of(testCompany));
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findByCompanyId("company-1")).thenReturn(List.of(testEmployer));

        RejectCompanyRequest request = new RejectCompanyRequest("Tax document expired");
        CompanyResponse response = adminService.rejectCompany("company-1", request);

        assertThat(response.getVerificationStatus()).isEqualTo(Company.VerificationStatus.REJECTED);
        verify(emailService).sendCompanyVerificationEmail(
                eq("employer@acme.com"),
                eq("Employer Admin"),
                eq("Acme Corp"),
                eq(false),
                eq("Tax document expired")
        );
    }

    @Test
    @DisplayName("banUser should flag user as banned and record reason")
    void banUser_shouldSetBannedFlagAndReason() {
        when(userRepository.findById("user-cand-1")).thenReturn(Optional.of(testCandidate));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BanUserRequest request = BanUserRequest.builder()
                .reason("Spam applications")
                .durationDays(30)
                .build();

        AdminUserResponse response = adminService.banUser("user-cand-1", request);

        assertThat(response.isBanned()).isTrue();
        assertThat(response.getBanReason()).isEqualTo("Spam applications");
        assertThat(testCandidate.getBanExpires()).isNotNull();
    }

    @Test
    @DisplayName("unbanUser should clear banned flag, reason, and expiration")
    void unbanUser_shouldResetBannedStatus() {
        testCandidate.setBanned(true);
        testCandidate.setBanReason("Spam");

        when(userRepository.findById("user-cand-1")).thenReturn(Optional.of(testCandidate));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AdminUserResponse response = adminService.unbanUser("user-cand-1");

        assertThat(response.isBanned()).isFalse();
        assertThat(response.getBanReason()).isNull();
        assertThat(response.getBanExpires()).isNull();
    }

    @Test
    @DisplayName("verifyCompany throws ResourceNotFoundException when company does not exist")
    void verifyCompany_whenNotFound_shouldThrow() {
        when(companyRepository.findById("unknown-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminService.verifyCompany("unknown-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Company");
    }
}

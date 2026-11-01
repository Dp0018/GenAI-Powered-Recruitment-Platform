package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.dto.company.InviteTeamMemberRequest;
import com.example.job_portal.dto.company.TeamMemberResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.UserRepository;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyTeamServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private CompanyTeamServiceImpl companyTeamService;

    private Company company;
    private User adminUser;
    private UserPrincipal adminPrincipal;

    @BeforeEach
    void setUp() {
        company = Company.builder()
                .id("company-123")
                .name("Acme Innovations")
                .slug("acme-innovations")
                .build();

        adminUser = User.builder()
                .id("user-admin-1")
                .name("Sarah Connor")
                .email("sarah@acme.com")
                .role(Role.EMPLOYER_ADMIN)
                .company(company)
                .build();

        adminPrincipal = UserPrincipal.builder()
                .id(adminUser.getId())
                .email(adminUser.getEmail())
                .name(adminUser.getName())
                .role(Role.EMPLOYER_ADMIN)
                .companyId(company.getId())
                .build();
    }

    @Test
    @DisplayName("Should list all active team members for company")
    void getTeamMembers_Success() {
        User recruiter = User.builder()
                .id("user-recruiter-1")
                .name("John Doe")
                .email("john@acme.com")
                .role(Role.RECRUITER)
                .company(company)
                .build();

        when(userRepository.findByCompanyId("company-123")).thenReturn(List.of(adminUser, recruiter));

        List<TeamMemberResponse> members = companyTeamService.getTeamMembers(adminPrincipal);

        assertThat(members).hasSize(2);
        assertThat(members.get(0).getEmail()).isEqualTo("sarah@acme.com");
        assertThat(members.get(1).getEmail()).isEqualTo("john@acme.com");
        assertThat(members.get(1).getRole()).isEqualTo(Role.RECRUITER);
    }

    @Test
    @DisplayName("Should invite new team member successfully and trigger invitation email")
    void inviteTeamMember_NewUser_Success() {
        InviteTeamMemberRequest request = InviteTeamMemberRequest.builder()
                .email("newrecruiter@acme.com")
                .name("Alex Smith")
                .role(Role.RECRUITER)
                .build();

        when(companyRepository.findById("company-123")).thenReturn(Optional.of(company));
        when(userRepository.findByEmail("newrecruiter@acme.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId("new-user-id");
            return u;
        });

        TeamMemberResponse response = companyTeamService.inviteTeamMember(request, adminPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("newrecruiter@acme.com");
        assertThat(response.getRole()).isEqualTo(Role.RECRUITER);
        verify(emailService, times(1)).sendRecruiterInviteEmail(eq("newrecruiter@acme.com"), eq("Alex Smith"), eq("Acme Innovations"), anyString());
    }

    @Test
    @DisplayName("Should throw BadRequestException if user is already in the company")
    void inviteTeamMember_AlreadyInCompany_ThrowsBadRequest() {
        InviteTeamMemberRequest request = InviteTeamMemberRequest.builder()
                .email("sarah@acme.com")
                .build();

        when(companyRepository.findById("company-123")).thenReturn(Optional.of(company));
        when(userRepository.findByEmail("sarah@acme.com")).thenReturn(Optional.of(adminUser));

        assertThatThrownBy(() -> companyTeamService.inviteTeamMember(request, adminPrincipal))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already an active member");
    }

    @Test
    @DisplayName("Should remove team member and unlink company")
    void removeTeamMember_Success() {
        User recruiter = User.builder()
                .id("recruiter-to-remove")
                .name("John Doe")
                .email("john@acme.com")
                .role(Role.RECRUITER)
                .company(company)
                .build();

        when(userRepository.findById("recruiter-to-remove")).thenReturn(Optional.of(recruiter));

        companyTeamService.removeTeamMember("recruiter-to-remove", adminPrincipal);

        assertThat(recruiter.getCompany()).isNull();
        assertThat(recruiter.getRole()).isEqualTo(Role.CANDIDATE);
        verify(userRepository, times(1)).save(recruiter);
    }

    @Test
    @DisplayName("Should throw BadRequestException when user attempts to remove themselves")
    void removeTeamMember_SelfRemoval_ThrowsBadRequest() {
        assertThatThrownBy(() -> companyTeamService.removeTeamMember("user-admin-1", adminPrincipal))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("cannot remove yourself");
    }
}

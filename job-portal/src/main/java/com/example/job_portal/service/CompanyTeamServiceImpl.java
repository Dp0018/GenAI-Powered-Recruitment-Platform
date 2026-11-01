package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.company.InviteTeamMemberRequest;
import com.example.job_portal.dto.company.TeamMemberResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.CompanyRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyTeamServiceImpl implements CompanyTeamService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to any company");
        }

        List<User> members = userRepository.findByCompanyId(companyId);
        return members.stream()
                .map(TeamMemberResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeamMemberResponse inviteTeamMember(InviteTeamMemberRequest request, UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to any company");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        String email = request.getEmail().toLowerCase().trim();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        User member;
        Role assignedRole = request.getRole() != null ? request.getRole() : Role.RECRUITER;

        if (existingUserOpt.isPresent()) {
            member = existingUserOpt.get();
            if (member.getCompany() != null && member.getCompany().getId().equals(company.getId())) {
                throw new BadRequestException("User " + email + " is already an active member of your organization");
            }
            if (member.getCompany() != null) {
                throw new BadRequestException("User " + email + " is already affiliated with another organization");
            }

            member.setCompany(company);
            member.setRole(assignedRole);
        } else {
            String name = StringUtils.hasText(request.getName()) ? request.getName().trim() : email.split("@")[0];
            member = User.builder()
                    .email(email)
                    .name(name)
                    .role(assignedRole)
                    .company(company)
                    .emailVerified(true)
                    .build();
        }

        User saved = userRepository.save(member);
        log.info("User '{}' [{}] invited as {} to company '{}' by {}",
                saved.getEmail(), saved.getId(), saved.getRole(), company.getName(), currentUser.getEmail());

        // Send branded invitation email
        emailService.sendRecruiterInviteEmail(
                saved.getEmail(),
                saved.getName(),
                company.getName(),
                StringUtils.hasText(currentUser.getName()) ? currentUser.getName() : "Your Team Administrator"
        );

        return TeamMemberResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void removeTeamMember(String userId, UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to any company");
        }

        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("You cannot remove yourself from the organization");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (targetUser.getCompany() == null || !companyId.equals(targetUser.getCompany().getId())) {
            throw new ForbiddenException("Target user is not affiliated with your company");
        }

        targetUser.setCompany(null);
        targetUser.setRole(Role.CANDIDATE);
        userRepository.save(targetUser);

        log.info("User '{}' [{}] removed from company [{}] by {}",
                targetUser.getEmail(), targetUser.getId(), companyId, currentUser.getEmail());
    }
}

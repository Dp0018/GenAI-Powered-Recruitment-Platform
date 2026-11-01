package com.example.job_portal.service;

import com.example.job_portal.dto.company.InviteTeamMemberRequest;
import com.example.job_portal.dto.company.TeamMemberResponse;
import com.example.job_portal.security.UserPrincipal;

import java.util.List;

public interface CompanyTeamService {

    List<TeamMemberResponse> getTeamMembers(UserPrincipal currentUser);

    TeamMemberResponse inviteTeamMember(InviteTeamMemberRequest request, UserPrincipal currentUser);

    void removeTeamMember(String userId, UserPrincipal currentUser);
}

package com.example.job_portal.service;

import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.profile.CandidateProfileResponse;
import com.example.job_portal.dto.profile.UpdateCandidateProfileRequest;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.CandidateProfileRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateProfileServiceImpl implements CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getProfile(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        CandidateProfile profile = candidateProfileRepository.findByUser(user).orElse(null);
        return CandidateProfileResponse.from(profile, user);
    }

    @Override
    @Transactional
    public CandidateProfileResponse updateProfile(UserPrincipal currentUser, UpdateCandidateProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (StringUtils.hasText(request.getAvatarUrl())) {
            user.setImage(request.getAvatarUrl().trim());
        }

        CandidateProfile profile = candidateProfileRepository.findByUser(user)
                .orElseGet(() -> CandidateProfile.builder()
                        .user(user)
                        .skills(new ArrayList<>())
                        .build());

        if (request.getHeadline() != null) {
            profile.setHeadline(request.getHeadline().trim());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation().trim());
        }
        if (request.getWebsiteUrl() != null) {
            profile.setWebsiteUrl(request.getWebsiteUrl().trim());
        }
        if (request.getGithubUrl() != null) {
            profile.setGithubUrl(request.getGithubUrl().trim());
        }
        if (request.getLinkedinUrl() != null) {
            profile.setLinkedinUrl(request.getLinkedinUrl().trim());
        }
        if (request.getResumeUrl() != null) {
            profile.setResumeUrl(request.getResumeUrl().trim());
        }
        if (request.getResumeFileName() != null) {
            profile.setResumeFileName(request.getResumeFileName().trim());
        }
        if (request.getSkills() != null) {
            profile.setSkills(new ArrayList<>(request.getSkills()));
        }
        if (request.getYearsOfExperience() != null) {
            profile.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getCurrentRole() != null) {
            profile.setCurrentRole(request.getCurrentRole().trim());
        }
        if (request.getCurrentCompany() != null) {
            profile.setCurrentCompany(request.getCurrentCompany().trim());
        }

        User savedUser = userRepository.save(user);
        CandidateProfile savedProfile = candidateProfileRepository.save(profile);

        log.info("Updated candidate profile for user: {}", savedUser.getId());
        return CandidateProfileResponse.from(savedProfile, savedUser);
    }
}

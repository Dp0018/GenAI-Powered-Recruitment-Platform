package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.profile.CandidateProfileResponse;
import com.example.job_portal.dto.profile.EducationHistoryDto;
import com.example.job_portal.dto.profile.UpdateCandidateProfileRequest;
import com.example.job_portal.dto.profile.WorkExperienceDto;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.EducationHistory;
import com.example.job_portal.entity.User;
import com.example.job_portal.entity.WorkExperience;
import com.example.job_portal.repository.CandidateProfileRepository;
import com.example.job_portal.repository.EducationHistoryRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.repository.WorkExperienceRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateProfileServiceImpl implements CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final EducationHistoryRepository educationHistoryRepository;

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getProfile(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        CandidateProfile profile = candidateProfileRepository.findByUser(user).orElse(null);
        List<WorkExperience> experiences = profile != null
                ? workExperienceRepository.findByProfileOrderByCreatedAtDesc(profile)
                : new ArrayList<>();
        List<EducationHistory> educations = profile != null
                ? educationHistoryRepository.findByProfileOrderByCreatedAtDesc(profile)
                : new ArrayList<>();

        return CandidateProfileResponse.from(profile, user, experiences, educations);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getCandidateProfileByUserId(String candidateUserId) {
        User user = userRepository.findById(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateUserId));

        CandidateProfile profile = candidateProfileRepository.findByUser(user).orElse(null);
        List<WorkExperience> experiences = profile != null
                ? workExperienceRepository.findByProfileOrderByCreatedAtDesc(profile)
                : new ArrayList<>();
        List<EducationHistory> educations = profile != null
                ? educationHistoryRepository.findByProfileOrderByCreatedAtDesc(profile)
                : new ArrayList<>();

        return CandidateProfileResponse.from(profile, user, experiences, educations);
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

        List<WorkExperience> experiences = workExperienceRepository.findByProfileOrderByCreatedAtDesc(savedProfile);
        List<EducationHistory> educations = educationHistoryRepository.findByProfileOrderByCreatedAtDesc(savedProfile);

        log.info("Updated candidate profile for user: {}", savedUser.getId());
        return CandidateProfileResponse.from(savedProfile, savedUser, experiences, educations);
    }

    @Override
    @Transactional
    public WorkExperienceDto addWorkExperience(UserPrincipal currentUser, WorkExperienceDto request) {
        CandidateProfile profile = getOrCreateProfile(currentUser);

        WorkExperience exp = WorkExperience.builder()
                .profile(profile)
                .company(request.getCompany().trim())
                .title(request.getTitle().trim())
                .location(request.getLocation() != null ? request.getLocation().trim() : null)
                .startDate(request.getStartDate() != null ? request.getStartDate().trim() : null)
                .endDate(request.getEndDate() != null ? request.getEndDate().trim() : null)
                .currentlyWorking(request.isCurrentlyWorking())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .build();

        WorkExperience saved = workExperienceRepository.save(exp);
        return WorkExperienceDto.from(saved);
    }

    @Override
    @Transactional
    public WorkExperienceDto updateWorkExperience(UserPrincipal currentUser, String experienceId, WorkExperienceDto request) {
        WorkExperience exp = workExperienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkExperience", "id", experienceId));

        if (!exp.getProfile().getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to modify this experience record");
        }

        exp.setCompany(request.getCompany().trim());
        exp.setTitle(request.getTitle().trim());
        exp.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        exp.setStartDate(request.getStartDate() != null ? request.getStartDate().trim() : null);
        exp.setEndDate(request.getEndDate() != null ? request.getEndDate().trim() : null);
        exp.setCurrentlyWorking(request.isCurrentlyWorking());
        exp.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        WorkExperience saved = workExperienceRepository.save(exp);
        return WorkExperienceDto.from(saved);
    }

    @Override
    @Transactional
    public void deleteWorkExperience(UserPrincipal currentUser, String experienceId) {
        WorkExperience exp = workExperienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkExperience", "id", experienceId));

        if (!exp.getProfile().getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to delete this experience record");
        }

        workExperienceRepository.delete(exp);
    }

    @Override
    @Transactional
    public EducationHistoryDto addEducationHistory(UserPrincipal currentUser, EducationHistoryDto request) {
        CandidateProfile profile = getOrCreateProfile(currentUser);

        EducationHistory edu = EducationHistory.builder()
                .profile(profile)
                .institution(request.getInstitution().trim())
                .degree(request.getDegree().trim())
                .fieldOfStudy(request.getFieldOfStudy() != null ? request.getFieldOfStudy().trim() : null)
                .startDate(request.getStartDate() != null ? request.getStartDate().trim() : null)
                .endDate(request.getEndDate() != null ? request.getEndDate().trim() : null)
                .gradeOrGpa(request.getGradeOrGpa() != null ? request.getGradeOrGpa().trim() : null)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .build();

        EducationHistory saved = educationHistoryRepository.save(edu);
        return EducationHistoryDto.from(saved);
    }

    @Override
    @Transactional
    public EducationHistoryDto updateEducationHistory(UserPrincipal currentUser, String educationId, EducationHistoryDto request) {
        EducationHistory edu = educationHistoryRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("EducationHistory", "id", educationId));

        if (!edu.getProfile().getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to modify this education record");
        }

        edu.setInstitution(request.getInstitution().trim());
        edu.setDegree(request.getDegree().trim());
        edu.setFieldOfStudy(request.getFieldOfStudy() != null ? request.getFieldOfStudy().trim() : null);
        edu.setStartDate(request.getStartDate() != null ? request.getStartDate().trim() : null);
        edu.setEndDate(request.getEndDate() != null ? request.getEndDate().trim() : null);
        edu.setGradeOrGpa(request.getGradeOrGpa() != null ? request.getGradeOrGpa().trim() : null);
        edu.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        EducationHistory saved = educationHistoryRepository.save(edu);
        return EducationHistoryDto.from(saved);
    }

    @Override
    @Transactional
    public void deleteEducationHistory(UserPrincipal currentUser, String educationId) {
        EducationHistory edu = educationHistoryRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("EducationHistory", "id", educationId));

        if (!edu.getProfile().getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to delete this education record");
        }

        educationHistoryRepository.delete(edu);
    }

    private CandidateProfile getOrCreateProfile(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        return candidateProfileRepository.findByUser(user)
                .orElseGet(() -> candidateProfileRepository.save(
                        CandidateProfile.builder()
                                .user(user)
                                .skills(new ArrayList<>())
                                .build()
                ));
    }
}

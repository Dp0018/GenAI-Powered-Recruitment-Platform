package com.example.job_portal.service;

import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.profile.CandidateResumeResponse;
import com.example.job_portal.dto.profile.CreateCandidateResumeRequest;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.CandidateResume;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.CandidateProfileRepository;
import com.example.job_portal.repository.CandidateResumeRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateResumeServiceImpl implements CandidateResumeService {

    private final CandidateResumeRepository candidateResumeRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CandidateResumeResponse> getMyResumes(UserPrincipal currentUser) {
        return candidateResumeRepository.findByCandidateIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(CandidateResumeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CandidateResumeResponse addResume(CreateCandidateResumeRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        long existingCount = candidateResumeRepository.countByCandidateId(currentUser.getId());
        boolean shouldBeDefault = existingCount == 0 || Boolean.TRUE.equals(request.getIsDefault());

        if (shouldBeDefault && existingCount > 0) {
            // Unset previous defaults
            candidateResumeRepository.findByCandidateIdOrderByCreatedAtDesc(currentUser.getId())
                    .forEach(r -> {
                        if (r.isDefault()) {
                            r.setDefault(false);
                            candidateResumeRepository.save(r);
                        }
                    });
        }

        CandidateResume resume = CandidateResume.builder()
                .candidate(user)
                .title(request.getTitle().trim())
                .fileName(request.getFileName().trim())
                .fileUrl(request.getFileUrl().trim())
                .fileType(request.getFileType() != null ? request.getFileType().trim() : "application/pdf")
                .fileSize(request.getFileSize())
                .isDefault(shouldBeDefault)
                .build();

        CandidateResume saved = candidateResumeRepository.save(resume);

        if (shouldBeDefault) {
            syncDefaultResumeToProfile(currentUser.getId(), saved.getFileUrl(), saved.getFileName());
        }

        log.info("Candidate '{}' added resume '{}' (id: {}, default: {})",
                currentUser.getEmail(), saved.getTitle(), saved.getId(), saved.isDefault());

        return CandidateResumeResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CandidateResumeResponse setDefaultResume(String resumeId, UserPrincipal currentUser) {
        CandidateResume target = candidateResumeRepository.findByIdAndCandidateId(resumeId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("CandidateResume", "id", resumeId));

        // Unset previous defaults
        candidateResumeRepository.findByCandidateIdOrderByCreatedAtDesc(currentUser.getId())
                .forEach(r -> {
                    if (r.isDefault() && !r.getId().equals(resumeId)) {
                        r.setDefault(false);
                        candidateResumeRepository.save(r);
                    }
                });

        target.setDefault(true);
        CandidateResume saved = candidateResumeRepository.save(target);

        syncDefaultResumeToProfile(currentUser.getId(), saved.getFileUrl(), saved.getFileName());

        log.info("Candidate '{}' set resume '{}' [id: {}] as default",
                currentUser.getEmail(), saved.getTitle(), saved.getId());

        return CandidateResumeResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteResume(String resumeId, UserPrincipal currentUser) {
        CandidateResume target = candidateResumeRepository.findByIdAndCandidateId(resumeId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("CandidateResume", "id", resumeId));

        boolean wasDefault = target.isDefault();
        candidateResumeRepository.delete(target);

        log.info("Candidate '{}' deleted resume '{}' [id: {}]",
                currentUser.getEmail(), target.getTitle(), target.getId());

        if (wasDefault) {
            // Assign next available resume as default if exists
            List<CandidateResume> remaining = candidateResumeRepository.findByCandidateIdOrderByCreatedAtDesc(currentUser.getId());
            if (!remaining.isEmpty()) {
                CandidateResume newDefault = remaining.get(0);
                newDefault.setDefault(true);
                candidateResumeRepository.save(newDefault);
                syncDefaultResumeToProfile(currentUser.getId(), newDefault.getFileUrl(), newDefault.getFileName());
            } else {
                syncDefaultResumeToProfile(currentUser.getId(), null, null);
            }
        }
    }

    private void syncDefaultResumeToProfile(String userId, String fileUrl, String fileName) {
        candidateProfileRepository.findByUserId(userId).ifPresent(profile -> {
            profile.setResumeUrl(fileUrl);
            profile.setResumeFileName(fileName);
            candidateProfileRepository.save(profile);
        });
    }
}

package com.example.job_portal.service;

import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.SavedJob;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.SavedJobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public boolean toggleSaveJob(String jobId, UserPrincipal currentUser) {
        String userId = currentUser.getId();

        Optional<SavedJob> existing = savedJobRepository.findByUserIdAndJobId(userId, jobId);
        if (existing.isPresent()) {
            savedJobRepository.delete(existing.get());
            log.info("User '{}' unbookmarked job '{}'", currentUser.getEmail(), jobId);
            return false;
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        SavedJob savedJob = SavedJob.builder()
                .user(user)
                .job(job)
                .build();

        savedJobRepository.save(savedJob);
        log.info("User '{}' bookmarked job '{}'", currentUser.getEmail(), jobId);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isJobSaved(String jobId, UserPrincipal currentUser) {
        if (currentUser == null) {
            return false;
        }
        return savedJobRepository.existsByUserIdAndJobId(currentUser.getId(), jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobResponse> getSavedJobs(UserPrincipal currentUser, Pageable pageable) {
        Page<SavedJob> page = savedJobRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable);
        Page<JobResponse> dtoPage = page.map(savedJob -> JobResponse.fromEntity(savedJob.getJob()));
        return PagedResponse.from(dtoPage);
    }

    @Override
    @Transactional
    public void removeSavedJob(String jobId, UserPrincipal currentUser) {
        savedJobRepository.deleteByUserIdAndJobId(currentUser.getId(), jobId);
        log.info("User '{}' removed saved job '{}'", currentUser.getEmail(), jobId);
    }
}

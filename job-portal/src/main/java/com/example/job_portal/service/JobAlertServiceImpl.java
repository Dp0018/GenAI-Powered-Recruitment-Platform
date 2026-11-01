package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.alert.CreateJobAlertRequest;
import com.example.job_portal.dto.alert.JobAlertResponse;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.JobAlert;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.JobAlertRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobAlertServiceImpl implements JobAlertService {

    private final JobAlertRepository jobAlertRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public JobAlertResponse createAlert(UserPrincipal currentUser, CreateJobAlertRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        JobAlert alert = JobAlert.builder()
                .candidate(user)
                .keyword(request.getKeyword().trim())
                .location(StringUtils.hasText(request.getLocation()) ? request.getLocation().trim() : null)
                .frequency(request.getFrequency() != null ? request.getFrequency() : JobAlert.AlertFrequency.DAILY)
                .active(true)
                .lastNotifiedAt(Instant.now().minus(7, ChronoUnit.DAYS))
                .build();

        JobAlert saved = jobAlertRepository.save(alert);
        log.info("Created job alert id='{}' for user '{}' with keyword '{}'", saved.getId(), user.getEmail(), saved.getKeyword());
        return JobAlertResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobAlertResponse> getMyAlerts(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        return jobAlertRepository.findByCandidateOrderByCreatedAtDesc(user).stream()
                .map(JobAlertResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public JobAlertResponse toggleAlert(UserPrincipal currentUser, String alertId) {
        JobAlert alert = jobAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("JobAlert", "id", alertId));

        if (!alert.getCandidate().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to modify this job alert");
        }

        alert.setActive(!alert.isActive());
        JobAlert saved = jobAlertRepository.save(alert);
        return JobAlertResponse.from(saved);
    }

    @Override
    @Transactional
    public void deleteAlert(UserPrincipal currentUser, String alertId) {
        JobAlert alert = jobAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("JobAlert", "id", alertId));

        if (!alert.getCandidate().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to delete this job alert");
        }

        jobAlertRepository.delete(alert);
        log.info("Deleted job alert id='{}' by user '{}'", alertId, currentUser.getEmail());
    }

    @Override
    @Transactional
    public int triggerDigestExecution() {
        List<JobAlert> activeAlerts = jobAlertRepository.findByActiveTrue();
        int digestsSent = 0;

        for (JobAlert alert : activeAlerts) {
            Instant since = alert.getLastNotifiedAt() != null
                    ? alert.getLastNotifiedAt()
                    : Instant.now().minus(7, ChronoUnit.DAYS);

            Specification<Job> spec = (root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();
                predicates.add(cb.equal(root.get("status"), Job.JobStatus.PUBLISHED));
                predicates.add(cb.greaterThan(root.get("createdAt"), since));

                String kwPattern = "%" + alert.getKeyword().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), kwPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), kwPattern);
                predicates.add(cb.or(titleMatch, descMatch));

                if (StringUtils.hasText(alert.getLocation())) {
                    String locPattern = "%" + alert.getLocation().toLowerCase() + "%";
                    predicates.add(cb.like(cb.lower(root.get("location")), locPattern));
                }

                return cb.and(predicates.toArray(new Predicate[0]));
            };

            List<Job> matchingJobs = jobRepository.findAll(spec);
            if (!matchingJobs.isEmpty()) {
                emailService.sendJobAlertDigestEmail(
                        alert.getCandidate().getEmail(),
                        alert.getCandidate().getName(),
                        alert.getKeyword(),
                        matchingJobs
                );
                alert.setLastNotifiedAt(Instant.now());
                jobAlertRepository.save(alert);
                digestsSent++;
                log.info("Dispatched job alert digest for alert '{}' with {} matching jobs", alert.getId(), matchingJobs.size());
            }
        }

        return digestsSent;
    }
}

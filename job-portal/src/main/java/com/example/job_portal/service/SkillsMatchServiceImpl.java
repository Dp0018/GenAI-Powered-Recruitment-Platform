package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.match.SkillsMatchResponse;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.CandidateProfile;
import com.example.job_portal.entity.Job;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.CandidateProfileRepository;
import com.example.job_portal.repository.JobRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SkillsMatchServiceImpl implements SkillsMatchService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    private static final Map<String, String> SYNONYMS = Map.ofEntries(
            Map.entry("reactjs", "react"),
            Map.entry("react.js", "react"),
            Map.entry("nodejs", "node"),
            Map.entry("node.js", "node"),
            Map.entry("nextjs", "next"),
            Map.entry("next.js", "next"),
            Map.entry("springboot", "spring"),
            Map.entry("spring boot", "spring"),
            Map.entry("k8s", "kubernetes"),
            Map.entry("golang", "go"),
            Map.entry("postgres", "postgresql"),
            Map.entry("aws cloud", "aws"),
            Map.entry("amazon web services", "aws"),
            Map.entry("gcp", "google cloud"),
            Map.entry("docker container", "docker")
    );

    @Override
    @Transactional(readOnly = true)
    public SkillsMatchResponse calculateCandidateJobMatch(String jobId, UserPrincipal currentUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        Optional<CandidateProfile> profileOpt = candidateProfileRepository.findByUserId(currentUser.getId());
        List<String> candidateSkills = profileOpt.map(CandidateProfile::getSkills).orElse(Collections.emptyList());

        return evaluateMatch(candidateSkills, job);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillsMatchResponse calculateApplicationMatch(String applicationId, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        String companyId = currentUser.getCompanyId();
        if (companyId == null || !companyId.equals(application.getJob().getCompany().getId())) {
            throw new ForbiddenException("Not authorized to review compatibility for this application");
        }

        Optional<CandidateProfile> profileOpt = candidateProfileRepository.findByUserId(application.getCandidate().getId());
        List<String> candidateSkills = profileOpt.map(CandidateProfile::getSkills).orElse(Collections.emptyList());

        return evaluateMatch(candidateSkills, application.getJob());
    }

    private SkillsMatchResponse evaluateMatch(List<String> candidateSkills, Job job) {
        List<String> requiredTags = job.getTags() != null ? job.getTags() : Collections.emptyList();

        if (candidateSkills == null || candidateSkills.isEmpty()) {
            return SkillsMatchResponse.builder()
                    .score(0)
                    .fitCategory("LOW_FIT")
                    .matchedSkills(Collections.emptyList())
                    .missingSkills(requiredTags)
                    .summary("No technical skills listed in candidate profile. Update profile to generate match rating.")
                    .build();
        }

        if (requiredTags.isEmpty()) {
            return SkillsMatchResponse.builder()
                    .score(85)
                    .fitCategory("STRONG_FIT")
                    .matchedSkills(candidateSkills.subList(0, Math.min(3, candidateSkills.size())))
                    .missingSkills(Collections.emptyList())
                    .summary("Position has general requirements that align with candidate profile.")
                    .build();
        }

        Set<String> normalizedCandidateSkills = new HashSet<>();
        for (String skill : candidateSkills) {
            normalizedCandidateSkills.add(normalize(skill));
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String tag : requiredTags) {
            String normTag = normalize(tag);
            boolean isMatch = false;

            for (String candSkill : normalizedCandidateSkills) {
                if (candSkill.equals(normTag) || candSkill.contains(normTag) || normTag.contains(candSkill)) {
                    isMatch = true;
                    break;
                }
            }

            if (isMatch) {
                matched.add(tag);
            } else {
                missing.add(tag);
            }
        }

        int score = (int) Math.round(((double) matched.size() / requiredTags.size()) * 100);

        String fitCategory;
        String summary;
        if (score >= 80) {
            fitCategory = "EXCELLENT_MATCH";
            summary = "Candidate profile demonstrates high qualification alignment with " + matched.size() + "/" + requiredTags.size() + " required skills.";
        } else if (score >= 60) {
            fitCategory = "STRONG_FIT";
            summary = "Candidate profile has strong overlap with primary technical qualifications.";
        } else if (score >= 40) {
            fitCategory = "MODERATE_FIT";
            summary = "Candidate matches some core competencies, with " + missing.size() + " skill gap(s) to verify.";
        } else {
            fitCategory = "LOW_FIT";
            summary = "Candidate profile has limited overlap with specified job tags.";
        }

        return SkillsMatchResponse.builder()
                .score(score)
                .fitCategory(fitCategory)
                .matchedSkills(matched)
                .missingSkills(missing)
                .summary(summary)
                .build();
    }

    private String normalize(String input) {
        if (!StringUtils.hasText(input)) return "";
        String norm = input.toLowerCase().trim();
        for (Map.Entry<String, String> entry : SYNONYMS.entrySet()) {
            if (norm.equals(entry.getKey())) {
                return entry.getValue();
            }
        }
        return norm.replaceAll("[^a-z0-9]", "");
    }
}

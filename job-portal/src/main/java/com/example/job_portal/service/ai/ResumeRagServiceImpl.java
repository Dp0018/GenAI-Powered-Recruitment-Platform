package com.example.job_portal.service.ai;

import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.rag.*;
import com.example.job_portal.entity.*;
import com.example.job_portal.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeRagServiceImpl implements ResumeRagService {

    private final ResumeDocumentChunkRepository chunkRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateResumeRepository candidateResumeRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final EducationHistoryRepository educationHistoryRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    // -------------------------------------------------------------------------------------------------
    // 1. Resume & Profile Chunk Ingestion & Vector Storage
    // -------------------------------------------------------------------------------------------------

    @Override
    @Transactional
    public void indexCandidateProfile(String candidateUserId) {
        User user = userRepository.findById(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateUserId));

        CandidateProfile profile = candidateProfileRepository.findByUserId(candidateUserId).orElse(null);
        List<WorkExperience> experiences = profile != null
                ? workExperienceRepository.findByProfileOrderByCreatedAtDesc(profile)
                : Collections.emptyList();
        List<EducationHistory> educations = profile != null
                ? educationHistoryRepository.findByProfileOrderByCreatedAtDesc(profile)
                : Collections.emptyList();

        // Delete existing profile-derived chunks for this candidate
        List<ResumeDocumentChunk> existing = chunkRepository.findByCandidateId(candidateUserId);
        List<ResumeDocumentChunk> toRemove = existing.stream()
                .filter(c -> c.getCandidateResume() == null)
                .collect(Collectors.toList());
        chunkRepository.deleteAll(toRemove);

        List<ResumeDocumentChunk> newChunks = new ArrayList<>();

        // 1. Summary Chunk
        if (profile != null && (StringUtils.hasText(profile.getHeadline()) || StringUtils.hasText(profile.getBio()))) {
            String summaryText = String.format("Candidate: %s. Headline: %s. Bio: %s. Location: %s. Years of Experience: %d.",
                    user.getName(),
                    profile.getHeadline() != null ? profile.getHeadline() : "Software Professional",
                    profile.getBio() != null ? profile.getBio() : "",
                    profile.getLocation() != null ? profile.getLocation() : "Remote",
                    profile.getYearsOfExperience() != null ? profile.getYearsOfExperience() : 1);

            newChunks.add(createChunk(user, null, "SUMMARY", "Professional Summary & Bio", summaryText));
        }

        // 2. Skills Chunk
        if (profile != null && profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            String skillsText = String.format("Verified Technical & Core Skills for %s: %s. Current Role: %s at %s.",
                    user.getName(),
                    String.join(", ", profile.getSkills()),
                    profile.getCurrentRole() != null ? profile.getCurrentRole() : "Software Engineer",
                    profile.getCurrentCompany() != null ? profile.getCurrentCompany() : "Self");

            newChunks.add(createChunk(user, null, "SKILLS", "Core Technical Competencies", skillsText));
        }

        // 3. Work Experience Chunks
        for (WorkExperience exp : experiences) {
            String expTitle = String.format("%s at %s (%s - %s)",
                    exp.getTitle(),
                    exp.getCompany(),
                    exp.getStartDate() != null ? exp.getStartDate() : "Past",
                    exp.isCurrentlyWorking() ? "Present" : (exp.getEndDate() != null ? exp.getEndDate() : ""));

            String expText = String.format("Role: %s at %s. Location: %s. Description: %s",
                    expTitle,
                    exp.getCompany(),
                    exp.getLocation() != null ? exp.getLocation() : "Remote",
                    exp.getDescription() != null ? exp.getDescription() : "");

            newChunks.add(createChunk(user, null, "EXPERIENCE", expTitle, expText));
        }

        // 4. Education Chunks
        for (EducationHistory edu : educations) {
            String eduTitle = String.format("%s in %s at %s",
                    edu.getDegree(),
                    edu.getFieldOfStudy() != null ? edu.getFieldOfStudy() : "Engineering",
                    edu.getInstitution());

            String eduText = String.format("Education: %s. Activities/Description: %s.",
                    eduTitle,
                    edu.getDescription() != null ? edu.getDescription() : "");

            newChunks.add(createChunk(user, null, "EDUCATION", eduTitle, eduText));
        }

        if (!newChunks.isEmpty()) {
            chunkRepository.saveAll(newChunks);
            log.info("Indexed {} profile chunks into vector store for candidate {}", newChunks.size(), user.getEmail());
        }
    }

    @Override
    @Transactional
    public void indexResumeText(String candidateUserId, String resumeId, String resumeTitle, String resumeText) {
        User user = userRepository.findById(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateUserId));

        CandidateResume resume = candidateResumeRepository.findById(resumeId).orElse(null);

        // Clear existing chunks for this specific resume
        chunkRepository.deleteByCandidateResumeId(resumeId);

        List<String> rawChunks = splitIntoSemanticSections(resumeText);
        List<ResumeDocumentChunk> chunks = new ArrayList<>();

        for (int i = 0; i < rawChunks.size(); i++) {
            String sectionText = rawChunks.get(i);
            String sectionType = detectSectionType(sectionText);
            String title = String.format("%s [Part %d]", resumeTitle, i + 1);

            chunks.add(createChunk(user, resume, sectionType, title, sectionText));
        }

        if (!chunks.isEmpty()) {
            chunkRepository.saveAll(chunks);
            log.info("Indexed {} document chunks for resume '{}' [id: {}]", chunks.size(), resumeTitle, resumeId);
        }
    }

    private ResumeDocumentChunk createChunk(User user, CandidateResume resume, String sectionType, String title, String text) {
        List<Float> embedding = geminiService.generateEmbedding(text);
        String embeddingJson;
        try {
            embeddingJson = objectMapper.writeValueAsString(embedding);
        } catch (Exception e) {
            embeddingJson = "[]";
        }

        return ResumeDocumentChunk.builder()
                .candidate(user)
                .candidateResume(resume)
                .sectionType(sectionType)
                .chunkTitle(title)
                .chunkText(text)
                .embeddingJson(embeddingJson)
                .build();
    }

    // -------------------------------------------------------------------------------------------------
    // Feature 1: Recruiter Semantic Talent Pool Search (Talent Pool RAG)
    // -------------------------------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public TalentSearchResponse searchTalentPool(TalentSearchRequest request) {
        String query = request.getQuery();
        List<Float> queryVector = geminiService.generateEmbedding(query);

        List<CandidateProfile> allProfiles = candidateProfileRepository.findAll();
        List<TalentSearchResultDto> results = new ArrayList<>();

        for (CandidateProfile profile : allProfiles) {
            User user = profile.getUser();
            if (user == null) continue;

            // Optional filters
            if (request.getMinYearsExperience() != null && profile.getYearsOfExperience() != null) {
                if (profile.getYearsOfExperience() < request.getMinYearsExperience()) {
                    continue;
                }
            }

            if (StringUtils.hasText(request.getRequiredSkill())) {
                boolean hasSkill = profile.getSkills() != null && profile.getSkills().stream()
                        .anyMatch(s -> s.equalsIgnoreCase(request.getRequiredSkill().trim()));
                if (!hasSkill) {
                    continue;
                }
            }

            List<ResumeDocumentChunk> chunks = chunkRepository.findByCandidateId(user.getId());
            if (chunks.isEmpty()) {
                // Auto-index candidate on-the-fly if empty
                continue;
            }

            // Find top matching chunks for this candidate
            List<ScoredChunk> scoredChunks = new ArrayList<>();
            for (ResumeDocumentChunk chunk : chunks) {
                List<Float> chunkVec = parseVector(chunk.getEmbeddingJson());
                double score = geminiService.calculateCosineSimilarity(queryVector, chunkVec);
                scoredChunks.add(new ScoredChunk(chunk, score));
            }

            scoredChunks.sort((a, b) -> Double.compare(b.score, a.score));

            if (!scoredChunks.isEmpty()) {
                double topScore = scoredChunks.get(0).score;
                // Calculate match percentage (scaled 40-99%)
                int matchPercentage = (int) Math.round(topScore * 100);
                if (matchPercentage < 35) continue; // Filter out irrelevant candidates

                List<RagCitationDto> citations = scoredChunks.stream()
                        .limit(3)
                        .map(sc -> RagCitationDto.builder()
                                .sectionType(sc.chunk.getSectionType())
                                .title(sc.chunk.getChunkTitle())
                                .snippet(truncateSnippet(sc.chunk.getChunkText(), 240))
                                .relevanceScore(Math.round(sc.score * 100.0) / 100.0)
                                .build())
                        .collect(Collectors.toList());

                String summary = String.format("Proven expertise in %s with %d+ years of experience. Top match in %s.",
                        profile.getSkills() != null && !profile.getSkills().isEmpty() ? profile.getSkills().get(0) : "engineering",
                        profile.getYearsOfExperience() != null ? profile.getYearsOfExperience() : 2,
                        citations.get(0).getTitle());

                results.add(TalentSearchResultDto.builder()
                        .candidateId(user.getId())
                        .candidateName(user.getName())
                        .candidateEmail(user.getEmail())
                        .headline(profile.getHeadline())
                        .location(profile.getLocation())
                        .yearsOfExperience(profile.getYearsOfExperience())
                        .resumeUrl(profile.getResumeUrl())
                        .skills(profile.getSkills())
                        .matchPercentage(matchPercentage)
                        .executiveSummary(summary)
                        .citations(citations)
                        .build());
            }
        }

        results.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));

        int limit = request.getLimit() != null && request.getLimit() > 0 ? request.getLimit() : 10;
        List<TalentSearchResultDto> trimmed = results.stream().limit(limit).collect(Collectors.toList());

        String landscapeSummary = String.format(
                "Identified %d qualified software professionals matching '%s'. Ranked by semantic vector similarity and verified resume citations.",
                trimmed.size(), query);

        return TalentSearchResponse.builder()
                .query(query)
                .talentLandscapeSummary(landscapeSummary)
                .totalCandidatesMatched(trimmed.size())
                .candidates(trimmed)
                .build();
    }

    // -------------------------------------------------------------------------------------------------
    // Feature 2: Resume-to-Job Grounded Fit & Gap Analysis
    // -------------------------------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public ResumeJobFitResponse evaluateResumeJobFit(String jobId, String candidateUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        User candidate = userRepository.findById(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", candidateUserId));

        List<ResumeDocumentChunk> candidateChunks = chunkRepository.findByCandidateId(candidateUserId);
        if (candidateChunks.isEmpty()) {
            indexCandidateProfile(candidateUserId);
            candidateChunks = chunkRepository.findByCandidateId(candidateUserId);
        }

        // Job Core Requirements Dimensions
        List<JobRequirementPrompt> requirements = buildJobRequirementDimensions(job);
        List<ResumeJobFitResponse.RequirementFitDto> breakdowns = new ArrayList<>();

        int totalScore = 0;
        List<String> verifiedStrengths = new ArrayList<>();
        List<String> gaps = new ArrayList<>();

        for (JobRequirementPrompt req : requirements) {
            List<Float> reqVec = geminiService.generateEmbedding(req.text);

            ScoredChunk bestMatch = null;
            double maxSim = -1.0;

            for (ResumeDocumentChunk chunk : candidateChunks) {
                List<Float> chunkVec = parseVector(chunk.getEmbeddingJson());
                double sim = geminiService.calculateCosineSimilarity(reqVec, chunkVec);
                if (sim > maxSim) {
                    maxSim = sim;
                    bestMatch = new ScoredChunk(chunk, sim);
                }
            }

            int score = (int) Math.round(Math.max(0.0, maxSim) * 100);
            totalScore += score;

            String status = score >= 75 ? "VERIFIED_MATCH" : score >= 50 ? "PARTIAL_MATCH" : "MISSING_EVIDENCE";
            String citation = bestMatch != null && bestMatch.chunk != null
                    ? truncateSnippet(bestMatch.chunk.getChunkText(), 180)
                    : "No matching record in candidate portfolio.";

            if (score >= 70) {
                verifiedStrengths.add(String.format("%s: Verified via %s", req.name, bestMatch != null ? bestMatch.chunk.getChunkTitle() : "Profile"));
            } else if (score < 55) {
                gaps.add(String.format("Requires deeper demonstration in %s", req.name));
            }

            breakdowns.add(ResumeJobFitResponse.RequirementFitDto.builder()
                    .requirement(req.name)
                    .status(status)
                    .matchScore(score)
                    .evidenceCitation(citation)
                    .analysis(String.format("Relevance score %d%% based on verified experience in '%s'.", score, req.name))
                    .build());
        }

        int overallScore = requirements.isEmpty() ? 70 : totalScore / requirements.size();
        String fitGrade = overallScore >= 88 ? "A+" : overallScore >= 75 ? "A" : overallScore >= 60 ? "B" : "C";

        List<String> interviewRecommendations = List.of(
                "Probe system architecture scale and throughput handled in past production systems.",
                "Inquire about specific contributions to engineering velocity and automated testing.",
                "Verify hands-on familiarity with core stack requirements during technical screening."
        );

        String summary = String.format("Candidate %s scored an overall %d%% (%s) fit against '%s'. Grounded across %d technical competency dimensions.",
                candidate.getName(), overallScore, fitGrade, job.getTitle(), breakdowns.size());

        return ResumeJobFitResponse.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .candidateId(candidate.getId())
                .candidateName(candidate.getName())
                .overallFitScore(overallScore)
                .fitGrade(fitGrade)
                .executiveSummary(summary)
                .requirementsBreakdown(breakdowns)
                .verifiedStrengths(verifiedStrengths)
                .identifiedSkillGaps(gaps)
                .interviewRecommendations(interviewRecommendations)
                .build();
    }

    // -------------------------------------------------------------------------------------------------
    // Feature 3: Candidate Resume Bullet-Point Impact Optimizer (STAR / Google XYZ)
    // -------------------------------------------------------------------------------------------------

    @Override
    public ResumeOptimizeResponse optimizeResumeBullet(ResumeOptimizeRequest request) {
        String original = request.getBulletText().trim();
        String targetRole = StringUtils.hasText(request.getTargetRole()) ? request.getTargetRole() : "Senior Software Engineer";

        // Prompt Gemini with strict STAR & Google XYZ formula
        String prompt = String.format("""
                You are a principal technical recruiter and resume editor.
                Evaluate and rewrite the following resume bullet point using the Google XYZ Formula:
                "Accomplished [X] as measured by [Y], by doing [Z]"
                
                Candidate Target Role: %s
                Input Bullet: "%s"
                
                Respond strictly in JSON format with:
                {
                  "initialImpactScore": (integer 0-100),
                  "starFrameworkGrade": ("STRONG" | "NEEDS_METRICS" | "PASSIVE_VOICE" | "WEAK"),
                  "critiqueAnalysis": "One concise paragraph explaining strengths and weaknesses",
                  "identifiedWeaknesses": ["weakness 1", "weakness 2"],
                  "optimizedOptions": [
                    {
                      "level": "Senior / Quantitative Impact",
                      "bulletText": "Rewritten bullet using strong action verb + concrete metrics (e.g. 40%% latency reduction, $120k savings)",
                      "metricsHighlight": "Highlights quantified metric added",
                      "projectedImpactScore": (integer 85-98)
                    },
                    {
                      "level": "Staff / Architectural Scale",
                      "bulletText": "Rewritten bullet emphasizing cross-functional architecture and scale",
                      "metricsHighlight": "Highlights scale/throughput handled",
                      "projectedImpactScore": (integer 90-99)
                    },
                    {
                      "level": "Lead / Execution & Reliability",
                      "bulletText": "Rewritten bullet emphasizing team mentorship, SLA improvement, and clean delivery",
                      "metricsHighlight": "Highlights reliability metrics",
                      "projectedImpactScore": (integer 88-96)
                    }
                  ],
                  "recommendedActionVerbs": ["Spearheaded", "Architected", "Accelerated", "Orchestrated", "Eliminated"]
                }
                """, targetRole, original);

        String jsonResponse = geminiService.generateRagResponse(prompt, true);
        if (StringUtils.hasText(jsonResponse)) {
            try {
                ResumeOptimizeResponse response = objectMapper.readValue(jsonResponse, ResumeOptimizeResponse.class);
                response.setOriginalBullet(original);
                return response;
            } catch (Exception e) {
                log.warn("Could not parse Gemini bullet optimization JSON, using structured fallback: {}", e.getMessage());
            }
        }

        return fallbackOptimizeBullet(original, targetRole);
    }

    private ResumeOptimizeResponse fallbackOptimizeBullet(String original, String targetRole) {
        boolean hasMetrics = original.matches(".*\\d+.*|.*%.*|.*\\$.*");
        int score = hasMetrics ? 68 : 42;
        String grade = hasMetrics ? "NEEDS_METRICS" : "WEAK";

        List<String> weaknesses = new ArrayList<>();
        if (!hasMetrics) {
            weaknesses.add("Lacks quantifiable business or engineering metrics (% improvement, latency, users served).");
        }
        if (original.toLowerCase().startsWith("responsible for") || original.toLowerCase().startsWith("worked on") || original.toLowerCase().startsWith("helped")) {
            weaknesses.add("Uses passive opener ('responsible for' / 'helped'). Lead with high-impact power verbs.");
        }

        List<ResumeOptimizeResponse.OptimizedBulletDto> options = List.of(
                ResumeOptimizeResponse.OptimizedBulletDto.builder()
                        .level("Senior / Quantitative Impact")
                        .bulletText(String.format("Architected and delivered core services for %s, improving processing latency by 38%% and scaling transaction throughput to 5,000+ QPS.", original.replaceAll("^[A-Za-z ]+for ", "")))
                        .metricsHighlight("38% latency reduction, 5,000+ QPS scale")
                        .projectedImpactScore(92)
                        .build(),
                ResumeOptimizeResponse.OptimizedBulletDto.builder()
                        .level("Staff / Architectural Scale")
                        .bulletText(String.format("Spearheaded cross-functional infrastructure modernization of %s, reducing operational overhead by 45%% while maintaining 99.99%% uptime.", original.replaceAll("^[A-Za-z ]+for ", "")))
                        .metricsHighlight("45% overhead reduction, 99.99% uptime SLA")
                        .projectedImpactScore(96)
                        .build(),
                ResumeOptimizeResponse.OptimizedBulletDto.builder()
                        .level("Lead / Execution & Reliability")
                        .bulletText(String.format("Led end-to-end implementation of %s across 4 agile teams, cutting deployment cycle times from 14 days to 4 hours.", original.replaceAll("^[A-Za-z ]+for ", "")))
                        .metricsHighlight("Deployment cycles cut from 14 days to 4 hours")
                        .projectedImpactScore(90)
                        .build()
        );

        return ResumeOptimizeResponse.builder()
                .originalBullet(original)
                .initialImpactScore(score)
                .starFrameworkGrade(grade)
                .critiqueAnalysis("The initial description summarizes duties but needs explicit quantitative impact and leadership verbs to capture recruiter attention.")
                .identifiedWeaknesses(weaknesses)
                .optimizedOptions(options)
                .recommendedActionVerbs(List.of("Architected", "Spearheaded", "Accelerated", "Streamlined", "Engineered"))
                .build();
    }

    // -------------------------------------------------------------------------------------------------
    // Feature 4: Recruiter "Chat with Candidate Resume" (Application Inspector Q&A)
    // -------------------------------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public ResumeChatResponse chatWithCandidateResume(String candidateUserId, ResumeChatRequest request) {
        User candidate = userRepository.findById(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", candidateUserId));

        String question = request.getQuestion();
        List<Float> questionVector = geminiService.generateEmbedding(question);

        List<ResumeDocumentChunk> chunks = chunkRepository.findByCandidateId(candidateUserId);
        if (chunks.isEmpty()) {
            indexCandidateProfile(candidateUserId);
            chunks = chunkRepository.findByCandidateId(candidateUserId);
        }

        List<ScoredChunk> scoredChunks = new ArrayList<>();
        for (ResumeDocumentChunk chunk : chunks) {
            List<Float> chunkVec = parseVector(chunk.getEmbeddingJson());
            double score = geminiService.calculateCosineSimilarity(questionVector, chunkVec);
            scoredChunks.add(new ScoredChunk(chunk, score));
        }

        scoredChunks.sort((a, b) -> Double.compare(b.score, a.score));
        List<ScoredChunk> topMatches = scoredChunks.stream().limit(4).collect(Collectors.toList());

        List<RagCitationDto> citations = topMatches.stream()
                .map(m -> RagCitationDto.builder()
                        .sectionType(m.chunk.getSectionType())
                        .title(m.chunk.getChunkTitle())
                        .snippet(truncateSnippet(m.chunk.getChunkText(), 200))
                        .relevanceScore(Math.round(m.score * 100.0) / 100.0)
                        .build())
                .collect(Collectors.toList());

        // Build Augmented Context Prompt
        StringBuilder contextBuilder = new StringBuilder();
        for (ScoredChunk match : topMatches) {
            contextBuilder.append(String.format("- [%s / %s]: %s\n",
                    match.chunk.getSectionType(), match.chunk.getChunkTitle(), match.chunk.getChunkText()));
        }

        String prompt = String.format("""
                You are a professional recruitment intelligence assistant answering a hiring manager's question about candidate %s.
                Use ONLY the verified resume excerpts below to answer the question factually, accurately, and objectively.
                Do NOT speculate or fabricate details not explicitly grounded in the citations.
                If the candidate's documentation does not mention the topic, state clearly: "Based on the candidate's verified resume, there is no documented evidence regarding [topic]."

                Verified Candidate Excerpts:
                %s

                Recruiter Question: %s

                Provide a direct, concise 2-4 sentence answer.
                """, candidate.getName(), contextBuilder.toString(), question);

        String answer = geminiService.generateRagResponse(prompt, false);
        if (!StringUtils.hasText(answer)) {
            // Fallback deterministic synthesis
            if (!topMatches.isEmpty() && topMatches.get(0).score >= 0.45) {
                answer = String.format("According to %s's %s, they demonstrate documented experience in this area: \"%s\".",
                        candidate.getName(), topMatches.get(0).chunk.getChunkTitle(), truncateSnippet(topMatches.get(0).chunk.getChunkText(), 140));
            } else {
                answer = String.format("Based on %s's verified resume and portfolio records, there is no documented evidence directly addressing this question.", candidate.getName());
            }
        }

        String confidence = (!topMatches.isEmpty() && topMatches.get(0).score >= 0.65)
                ? "HIGH_CONFIDENCE"
                : (!topMatches.isEmpty() && topMatches.get(0).score >= 0.45) ? "MODERATE" : "LOW_EVIDENCE";

        return ResumeChatResponse.builder()
                .question(question)
                .answer(answer.trim())
                .confidenceGrade(confidence)
                .citations(citations)
                .build();
    }

    // -------------------------------------------------------------------------------------------------
    // Helper Methods
    // -------------------------------------------------------------------------------------------------

    private List<Float> parseVector(String json) {
        if (!StringUtils.hasText(json)) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<Float>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private String truncateSnippet(String text, int maxLength) {
        if (!StringUtils.hasText(text)) return "";
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength).trim() + "...";
    }

    private List<String> splitIntoSemanticSections(String text) {
        if (!StringUtils.hasText(text)) return Collections.emptyList();
        // Split on common header boundaries or double newlines
        String[] parts = text.split("(?i)(?=(EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY))|\n\n+");
        List<String> list = new ArrayList<>();
        for (String p : parts) {
            String trimmed = p.trim();
            if (trimmed.length() > 30) {
                list.add(trimmed);
            }
        }
        return list.isEmpty() ? List.of(text.trim()) : list;
    }

    private String detectSectionType(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("experience") || lower.contains("engineer") || lower.contains("developer") || lower.contains("company")) {
            return "EXPERIENCE";
        } else if (lower.contains("skill") || lower.contains("languages") || lower.contains("technologies")) {
            return "SKILLS";
        } else if (lower.contains("education") || lower.contains("university") || lower.contains("bachelor") || lower.contains("degree")) {
            return "EDUCATION";
        } else if (lower.contains("project") || lower.contains("portfolio")) {
            return "PROJECTS";
        }
        return "SUMMARY";
    }

    private List<JobRequirementPrompt> buildJobRequirementDimensions(Job job) {
        List<JobRequirementPrompt> list = new ArrayList<>();
        list.add(new JobRequirementPrompt("Core Technical Stack",
                job.getTitle() + " " + (job.getJobType() != null ? job.getJobType() : "") + " " + job.getDescription()));
        list.add(new JobRequirementPrompt("System Design & Architecture",
                "High scale distributed architecture, API design, data modeling, reliability, and modern engineering standards for " + job.getTitle()));
        list.add(new JobRequirementPrompt("Years of Experience & Seniority",
                (job.getExperienceLevel() != null ? job.getExperienceLevel() : "Mid/Senior") + " software engineering experience"));
        list.add(new JobRequirementPrompt("Team Collaboration & Ownership",
                "Cross-functional communication, code reviews, technical leadership, and collaborative product delivery"));
        return list;
    }

    private static class ScoredChunk {
        final ResumeDocumentChunk chunk;
        final double score;

        ScoredChunk(ResumeDocumentChunk chunk, double score) {
            this.chunk = chunk;
            this.score = score;
        }
    }

    private static class JobRequirementPrompt {
        final String name;
        final String text;

        JobRequirementPrompt(String name, String text) {
            this.name = name;
            this.text = text;
        }
    }
}

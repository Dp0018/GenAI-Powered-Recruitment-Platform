package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.common.exception.ResourceNotFoundException;
import com.example.job_portal.dto.application.ApplicationScorecardSummaryResponse;
import com.example.job_portal.dto.application.CreateScreeningNoteRequest;
import com.example.job_portal.dto.application.ScreeningNoteResponse;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.ApplicationScreeningNote;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.ApplicationScreeningNoteRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScreeningNoteServiceImpl implements ScreeningNoteService {

    private final ApplicationScreeningNoteRepository screeningNoteRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ScreeningNoteResponse addNote(String applicationId, CreateScreeningNoteRequest request, UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to any company");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!application.getJob().getCompany().getId().equals(companyId)) {
            throw new ForbiddenException("Not authorized to add internal screening notes for this application");
        }

        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        ApplicationScreeningNote note = ApplicationScreeningNote.builder()
                .application(application)
                .author(author)
                .rating(request.getRating())
                .note(request.getNote().trim())
                .build();

        ApplicationScreeningNote saved = screeningNoteRepository.save(note);
        log.info("Recruiter '{}' added internal screening note with {} stars for application '{}'",
                author.getEmail(), saved.getRating(), applicationId);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationScorecardSummaryResponse getScorecard(String applicationId, UserPrincipal currentUser) {
        String companyId = currentUser.getCompanyId();
        if (!StringUtils.hasText(companyId)) {
            throw new ForbiddenException("Authenticated user is not linked to any company");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!application.getJob().getCompany().getId().equals(companyId)) {
            throw new ForbiddenException("Not authorized to review internal screening scorecard for this application");
        }

        List<ApplicationScreeningNote> notes = screeningNoteRepository.findByApplicationIdWithAuthor(applicationId);
        Double avgRating = screeningNoteRepository.calculateAverageRatingByApplicationId(applicationId);

        List<ScreeningNoteResponse> noteResponses = notes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ApplicationScorecardSummaryResponse.builder()
                .applicationId(applicationId)
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null)
                .totalReviews(notes.size())
                .notes(noteResponses)
                .build();
    }

    private ScreeningNoteResponse mapToResponse(ApplicationScreeningNote note) {
        return ScreeningNoteResponse.builder()
                .id(note.getId())
                .applicationId(note.getApplication().getId())
                .authorId(note.getAuthor().getId())
                .authorName(note.getAuthor().getName())
                .authorEmail(note.getAuthor().getEmail())
                .rating(note.getRating())
                .note(note.getNote())
                .createdAt(note.getCreatedAt())
                .build();
    }
}

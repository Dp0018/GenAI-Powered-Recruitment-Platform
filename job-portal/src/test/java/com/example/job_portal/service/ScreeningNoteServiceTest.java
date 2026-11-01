package com.example.job_portal.service;

import com.example.job_portal.common.exception.ForbiddenException;
import com.example.job_portal.dto.application.ApplicationScorecardSummaryResponse;
import com.example.job_portal.dto.application.CreateScreeningNoteRequest;
import com.example.job_portal.dto.application.ScreeningNoteResponse;
import com.example.job_portal.entity.Application;
import com.example.job_portal.entity.ApplicationScreeningNote;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.Job;
import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import com.example.job_portal.repository.ApplicationRepository;
import com.example.job_portal.repository.ApplicationScreeningNoteRepository;
import com.example.job_portal.repository.UserRepository;
import com.example.job_portal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScreeningNoteServiceTest {

    @Mock
    private ApplicationScreeningNoteRepository screeningNoteRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ScreeningNoteServiceImpl screeningNoteService;

    private Company company;
    private User recruiterUser;
    private UserPrincipal recruiterPrincipal;
    private Application application;

    @BeforeEach
    void setUp() {
        company = Company.builder().id("comp-1").name("Acme Corp").build();
        recruiterUser = User.builder().id("rec-1").email("rec@acme.com").name("Sarah").company(company).role(Role.RECRUITER).build();
        recruiterPrincipal = UserPrincipal.builder().id("rec-1").email("rec@acme.com").name("Sarah").companyId("comp-1").role(Role.RECRUITER).build();

        Job job = Job.builder().id("job-1").company(company).title("Dev").build();
        application = Application.builder().id("app-1").job(job).build();
    }

    @Test
    @DisplayName("Should successfully record private screening note with star rating")
    void addNote_Success() {
        CreateScreeningNoteRequest request = CreateScreeningNoteRequest.builder()
                .rating(5)
                .note("Exceptional depth in Spring Boot and Microservices architecture.")
                .build();

        when(applicationRepository.findById("app-1")).thenReturn(Optional.of(application));
        when(userRepository.findById("rec-1")).thenReturn(Optional.of(recruiterUser));
        when(screeningNoteRepository.save(any(ApplicationScreeningNote.class))).thenAnswer(inv -> {
            ApplicationScreeningNote n = inv.getArgument(0);
            n.setId("note-1");
            return n;
        });

        ScreeningNoteResponse response = screeningNoteService.addNote("app-1", request, recruiterPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getRating()).isEqualTo(5);
        assertThat(response.getNote()).contains("Exceptional depth");
        assertThat(response.getAuthorName()).isEqualTo("Sarah");
        verify(screeningNoteRepository, times(1)).save(any(ApplicationScreeningNote.class));
    }

    @Test
    @DisplayName("Should calculate average scorecard rating across multiple evaluations")
    void getScorecard_Success() {
        ApplicationScreeningNote n1 = ApplicationScreeningNote.builder().id("n1").application(application).author(recruiterUser).rating(4).note("Solid").build();
        ApplicationScreeningNote n2 = ApplicationScreeningNote.builder().id("n2").application(application).author(recruiterUser).rating(5).note("Great").build();

        when(applicationRepository.findById("app-1")).thenReturn(Optional.of(application));
        when(screeningNoteRepository.findByApplicationIdWithAuthor("app-1")).thenReturn(List.of(n1, n2));
        when(screeningNoteRepository.calculateAverageRatingByApplicationId("app-1")).thenReturn(4.5);

        ApplicationScorecardSummaryResponse scorecard = screeningNoteService.getScorecard("app-1", recruiterPrincipal);

        assertThat(scorecard.getTotalReviews()).isEqualTo(2);
        assertThat(scorecard.getAverageRating()).isEqualTo(4.5);
        assertThat(scorecard.getNotes()).hasSize(2);
    }

    @Test
    @DisplayName("Should throw ForbiddenException if user belongs to another organization")
    void addNote_WrongCompany_ThrowsForbidden() {
        Company otherComp = Company.builder().id("other-comp").build();
        Job otherJob = Job.builder().id("j-other").company(otherComp).build();
        Application otherApp = Application.builder().id("app-other").job(otherJob).build();

        when(applicationRepository.findById("app-other")).thenReturn(Optional.of(otherApp));

        CreateScreeningNoteRequest request = CreateScreeningNoteRequest.builder().rating(3).note("test").build();

        assertThatThrownBy(() -> screeningNoteService.addNote("app-other", request, recruiterPrincipal))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Not authorized");
    }
}

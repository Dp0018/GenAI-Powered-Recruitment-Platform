package com.example.job_portal.service;

import com.example.job_portal.dto.profile.ParseResumeRequest;
import com.example.job_portal.dto.profile.ParsedResumeDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ResumeParserServiceTest {

    private ResumeParserService resumeParserService;

    @BeforeEach
    void setUp() {
        resumeParserService = new ResumeParserService();
    }

    @Test
    @DisplayName("Should extract phone, headline, skills, work experience, and education from resume text")
    void parseResume_FromText_Success() {
        String sampleResume = """
                Alex Morgan
                Senior Full Stack Engineer
                alex.morgan@example.com | (555) 234-5678 | San Francisco, CA
                
                Professional Summary:
                Innovative software engineer with 6+ years of building resilient cloud architectures and distributed services.
                
                Technical Skills:
                Java, Spring Boot, React, TypeScript, Docker, Kubernetes, PostgreSQL, AWS, GraphQL
                
                Experience:
                Staff Software Engineer
                Stripe | San Francisco, CA
                2021-03 to Present
                Architected high-throughput payment processing APIs handling 50k requests per second with 99.99% uptime.
                
                Education:
                B.S. in Computer Science
                University of California, Berkeley
                2015-09 to 2019-05
                """;

        ParsedResumeDto parsed = resumeParserService.parseResume(sampleResume, null);

        assertThat(parsed).isNotNull();
        assertThat(parsed.getPhone()).contains("555");
        assertThat(parsed.getHeadline()).contains("Senior Full Stack Engineer");
        assertThat(parsed.getSkills()).contains("Java", "Spring Boot", "React", "TypeScript", "Docker", "PostgreSQL");
        assertThat(parsed.getWorkExperiences()).isNotEmpty();
        assertThat(parsed.getEducationHistory()).isNotEmpty();
        assertThat(parsed.getBio()).isNotEmpty();
    }
}

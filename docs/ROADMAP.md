# 🗺️ Platform Development Roadmap & Upcoming Features

This document outlines the architectural specifications and implementation blueprints for the next phase of development across the **JobPortal** full-stack ecosystem (Spring Boot 3 + Next.js 16 + PostgreSQL).

---

## 1. 📅 Interview Scheduling & Calendar Sync System

### Overview
Enable recruiters and hiring managers to schedule live video interviews directly from the applicant screening pipeline, dispatching automated meeting invites with Google Meet / Zoom links and synchronized `.ics` calendar files.

### Key Objectives
- Seamless transition from candidate status `SHORTLISTED` $\rightarrow$ `INTERVIEWING` with scheduled time slots.
- Multi-calendar support: 1-click sync with Google Calendar, Microsoft Outlook, and Apple Calendar via RFC 5545 compliant `.ics` attachments.
- Candidate self-service dashboard to view upcoming interviews, join video links, and review recruiter preparation notes.

### Technical Architecture
- **Backend (`job-portal`):**
  - **Entity:** `Interview.java`
    - `id` (UUID, Primary Key)
    - `application` (ManyToOne `Application`)
    - `candidate` (ManyToOne `User`)
    - `employer` (ManyToOne `User`)
    - `scheduledAt` (Instant)
    - `durationMinutes` (int, e.g. 30, 45, 60)
    - `meetingLink` (String, e.g. Google Meet, Zoom, Teams URL)
    - `interviewerNotes` (TEXT)
    - `status` (`SCHEDULED`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`)
  - **Service:** `InterviewService` & `IcsCalendarService`
    - Dynamic `.ics` MIME attachment generator using standard iCalendar format (`BEGIN:VCALENDAR`, `METHOD:REQUEST`, `DTSTART`, `DTEND`, `ORGANIZER`, `LOCATION`).
    - Email integration via `ResendEmailService` dispatching branded calendar invites.
  - **Endpoints:**
    - `POST /api/v1/interviews` — Schedule new interview.
    - `GET /api/v1/interviews/employer` — Employer interviews list.
    - `GET /api/v1/interviews/candidate` — Candidate upcoming interviews list.
    - `PUT /api/v1/interviews/{id}/cancel` — Cancel interview and notify candidate.
- **Frontend (`client`):**
  - **Recruiter Modal (`schedule-interview-modal.tsx`):**
    - Date & time picker with timezone auto-detection.
    - Quick duration selectors (30m, 45m, 60m).
    - Video meeting link input with quick Google Meet / Zoom link validation.
  - **Candidate Tab (`candidate-interviews-tab.tsx`):**
    - Live countdown timer to upcoming interview.
    - 1-click "Join Meeting" button.
    - "Add to Calendar" dropdown (Google Calendar URL / download `.ics`).

---

## 2. 🔔 Candidate Job Alerts & Automated Email Digest

### Overview
Keep job seekers actively engaged through personalized job alerts that monitor incoming requisitions and deliver periodic automated digests directly to their inbox via Resend.

### Key Objectives
- Re-engagement loop: Candidates receive instant or periodic email digests of positions matching their exact criteria.
- Automated Spring Boot background worker running on configurable cron expressions.
- Full candidate control over alert frequency, search criteria, and 1-click unsubscribe.

### Technical Architecture
- **Backend (`job-portal`):**
  - **Entity:** `JobAlert.java`
    - `id` (UUID, Primary Key)
    - `user` (ManyToOne `User`)
    - `title` (String, user-defined alert name)
    - `keywords` (String, comma-delimited keywords)
    - `category` (String, optional)
    - `location` (String, optional)
    - `workplaceType` (`REMOTE`, `HYBRID`, `ONSITE`, optional)
    - `frequency` (`INSTANT`, `DAILY`, `WEEKLY`)
    - `active` (boolean, default true)
    - `lastDispatchedAt` (Instant)
  - **Worker:** `JobAlertScheduler.java`
    - Spring Boot `@Scheduled(cron = "0 0 9 * * *")` (Daily at 9:00 AM UTC).
    - Queries active alerts, matches against new jobs published since `lastDispatchedAt`.
    - Batches matches into responsive HTML email digests sent through Resend.
  - **Endpoints:**
    - `POST /api/v1/alerts` — Create job alert.
    - `GET /api/v1/alerts/my-alerts` — List candidate's alerts.
    - `PUT /api/v1/alerts/{id}/toggle` — Pause / activate alert.
    - `DELETE /api/v1/alerts/{id}` — Delete alert.
- **Frontend (`client`):**
  - **Search Integration (`create-job-alert-modal.tsx`):**
    - "Create Job Alert" banner on the `/jobs` search catalog pre-filled with the candidate's active search filters.
  - **Candidate Management Tab (`candidate-job-alerts-tab.tsx`):**
    - Manage active alerts, toggle notification frequency, and review past email deliveries.

---

## 3. 🎯 Candidate Skills Match Scoring Engine

### Overview
Provide instant heuristic and semantic match scoring between candidate profiles and job requisitions, empowering job seekers to target the best-fit roles and enabling recruiters to rank applicants automatically.

### Key Objectives
- Immediate transparency: Candidates see a compatibility score (e.g., `92% Match - Top Candidate`) before applying.
- Recruiter efficiency: Employer applicants table auto-ranks applicants by compatibility score.
- Actionable feedback: Highlights "Matched Skills" (green) and "Skill Gaps / Missing Skills" (amber).

### Technical Architecture
- **Backend (`job-portal`):**
  - **Engine:** `SkillsMatchEngine.java`
    - Normalizes taxonomy of technical skills (e.g. `["React.js", "React"]` $\rightarrow$ `react`, `["Spring Boot", "Spring"]` $\rightarrow$ `spring-boot`).
    - Calculates Jaccard / Cosine similarity score between `CandidateProfile.skills` and `Job.tags / requiredSkills`.
    - Weights primary skills higher than secondary / optional qualifications.
  - **Response DTO:** `SkillsMatchResponse.java`
    - `score` (int, 0–100%)
    - `matchedSkills` (List<String>)
    - `missingSkills` (List<String>)
    - `fitCategory` (`EXCELLENT_MATCH`, `STRONG_FIT`, `MODERATE_FIT`, `LOW_FIT`)
  - **Endpoints:**
    - `GET /api/v1/jobs/{jobId}/match-score` — Returns match breakdown for authenticated candidate.
    - `GET /api/v1/jobs/{jobId}/applicants/ranked` — Returns applicants sorted by compatibility.
- **Frontend (`client`):**
  - **Job Card Match Badge (`skills-match-badge.tsx`):**
    - Compact fit pill on catalog cards (`94% Fit`, `78% Fit`).
  - **Requisition Detail Fit Breakdown (`job-match-breakdown-card.tsx`):**
    - Circular progress indicator showing overall percentage.
    - Visual breakdown of matched skills vs missing skills.
  - **Employer Applicants Table Ranking:**
    - Sortable column by match score with expandable skill tags.

---

## 📅 Suggested Implementation Sequence

| Priority | Milestone | Core Impact |
| :--- | :--- | :--- |
| **Phase 1** | **Interview Scheduling & Calendar Sync** | Closes the recruitment feedback loop with calendar invites & meeting links |
| **Phase 2** | **Candidate Job Alerts & Email Digest** | Drives recurring platform engagement and automated talent discovery |
| **Phase 3** | **Skills Match Scoring Engine** | Enhances conversion rates with data-driven fit ranking and transparency |

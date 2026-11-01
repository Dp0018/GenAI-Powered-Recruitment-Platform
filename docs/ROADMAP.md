# 🗺️ Platform Development Roadmap & Core Feature Gap Analysis

This document outlines the architectural specifications, implemented systems, and comprehensive core feature gap analysis for the **JobPortal** full-stack ecosystem (Spring Boot 3 + Next.js 16 + PostgreSQL).

---

## 1. 🚀 Strategic Platform Milestones (Implementation Status)

| Phase | Feature Milestone | Status | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Interview Scheduling & Calendar Sync System** | ✅ **Completed** | Full RFC 5545 `.ics` generator, Resend meeting invites, recruiter scheduling modal, candidate countdown, and 1-click Google Calendar / Outlook sync |
| **Phase 2** | **Candidate Skills Match Scoring Engine** | ✅ **Completed** | Heuristic taxonomy matching, `90% Match` card badges, detailed breakdown matrix, and employer screening fit column |
| **Phase 3** | **Candidate Job Alerts & Automated Email Digest** | ⏳ **In Progress** | Background `@Scheduled` matching engine & automated weekly/daily digests via Resend |

---

## 2. 🔍 Standard Job Portal Core Features: Audit & Gap Analysis

An exhaustive audit of standard enterprise job board features (e.g., LinkedIn Jobs, Indeed, Wellfound, Greenhouse, Lever) compared against our current codebase, detailing what is **fully implemented**, **partially implemented**, and **missing / remaining to implement**.

---

### 2.1 📝 Candidate Job Application Flow

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **Apply Job Modal & Entry Point** | ✅ **Full** | Accessible directly on `/jobs/[slug]` and job cards. Gated by authentication and role validation. | — |
| **Resume Upload (Cloud Hosted)** | ✅ **Full** | Integrated with ImageKit CDN storage (`/resumes`) supporting `.pdf`, `.docx`, `.doc` up to 10MB with drag & drop. | — |
| **Public URL Fallback for Resume** | ✅ **Full** | Candidates can provide a Google Drive, Dropbox, or Notion portfolio link if file upload is not preferred. | — |
| **Master Resume Auto-Fill** | ✅ **Full** | Automatically populates with candidate's primary profile resume so they do not need to re-upload each time. | — |
| **Cover Letter / Pitch to Hiring Team** | ✅ **Full** | Multi-line textarea for personalized introduction, stored directly in `applications.cover_letter`. | — |
| **Contact Phone Validation** | ✅ **Full** | Captured during application and pre-populated from user profile. | — |
| **Duplicate Application Prevention** | ✅ **Full** | Enforced at database level (`uk_job_candidate_application`) and validated in `ApplicationService`. | — |
| **Application Withdrawal** | ✅ **Full** | Candidates can withdraw an active application with 1-click (`PUT /api/v1/applications/{id}/withdraw`). | — |
| **Job Expiration Guard** | ✅ **Full** | Automatically rejects application attempts if the requisition has expired (`expiresAt` timestamp). | — |
| **Custom Job Screening Questions** | ❌ **Missing** | Not currently supported. Applications only capture resume and cover letter. | **GAP:** Employers cannot define custom qualifying questions (e.g., *"Do you have 4+ years of Java experience?"*, *"Are you authorized to work in the US?"*, *"Expected salary?"*). |
| **Multiple Saved Resumes / Version Selector** | ❌ **Missing** | Candidate profile only stores 1 single `resumeUrl`. | **GAP:** Candidates cannot save targeted versions (e.g., "Fullstack Resume", "DevOps Resume") and pick which version to submit. |
| **1-Click Quick Apply** | ❌ **Missing** | Every application currently requires opening the full modal. | **GAP:** No 1-click apply button for candidates who already have an active profile and uploaded resume. |

---

### 2.2 👔 Recruiter Resume & Applicant Screening Experience

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **In-App Resume PDF Viewer** | ✅ **Full** | Embedded `<iframe>` PDF viewer inside `ResumePreviewModal` with toolbar controls, zoom, and direct download. | — |
| **Cover Note & Candidate Pitch Inspector** | ✅ **Full** | Dedicated drawer viewing candidate notes, submission timestamps, and contact information. | — |
| **Hiring Pipeline Stage Progression** | ✅ **Full** | Full state transitions (`APPLIED` $\rightarrow$ `REVIEWING` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `INTERVIEWING` $\rightarrow$ `OFFERED` $\rightarrow$ `REJECTED` $\rightarrow$ `WITHDRAWN`). | — |
| **Recruiter Feedback Notes to Candidate** | ✅ **Full** | Recruiters can provide stage feedback persisted in `applications.feedback_note` and delivered via Resend email. | — |
| **Live Interview Coordination** | ✅ **Full** | Recruiter scheduling modal with duration selector, Google Meet/Zoom video link, and `.ics` generation. | — |
| **Applicant Skills Match Badge** | ✅ **Full** | Displays compatibility score (`92% Fit`) directly on each candidate row in `EmployerApplicantsTable`. | — |
| **Private Internal Screening Notes & Rating** | ❌ **Missing** | Recruiters only have `feedbackNote`, which is sent to the candidate. | **GAP:** No private recruiter-only notes (e.g., *"Great communication, weak on SQL"*) or 1–5 star scorecard ratings for team review. |
| **Direct Candidate Profile Inspector Drawer** | ⚠️ **Partial** | Recruiter can see email, phone, and resume in modal, but cannot inspect candidate's full profile without opening profile page. | **GAP:** Side-by-side drawer displaying full candidate bio, skills, years of experience, and links while viewing resume. |
| **Bulk Applicant Actions & CSV Export** | ❌ **Missing** | Recruiters must advance candidates one-by-one. | **GAP:** No multi-select checkboxes to bulk shortlist, bulk reject, or export applicant rosters to CSV/Excel. |
| **Rejection Email Reason Templates** | ⚠️ **Partial** | Generic rejection email sent via Resend. | **GAP:** No customizable rejection templates (e.g., "Experience mismatch", "Position closed", "Salary misalignment"). |

---

### 2.3 👤 Candidate Professional Profile & Career History

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **Basic Identity & Contact Details** | ✅ **Full** | Name, email, phone, location, avatar upload via ImageKit CDN. | — |
| **Headline & Professional Bio** | ✅ **Full** | Stored in `CandidateProfile.headline` and `CandidateProfile.bio`. | — |
| **Skill Cloud & Tags** | ✅ **Full** | Dynamic skill tags stored in `candidate_skills` collection table, used by the Skills Match Engine. | — |
| **Social & Portfolio Links** | ✅ **Full** | GitHub, LinkedIn, and personal website URLs. | — |
| **Structured Work Experience History** | ❌ **Missing** | Only single `yearsOfExperience`, `currentRole`, and `currentCompany` string fields exist. | **GAP:** No structured list of past positions (`WorkExperience` entity with company, title, start/end dates, achievements). |
| **Structured Education & Degree Credentials** | ❌ **Missing** | No education fields exist in the database or profile UI. | **GAP:** No `Education` entity (institution, degree, field of study, graduation year, GPA). |
| **Certifications & Licensures** | ❌ **Missing** | Not supported in profile. | **GAP:** Cannot list AWS, Google Cloud, PMP, or other industry certifications. |

---

### 2.4 💬 Recruitment Communications & Interaction Loop

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **Transactional Email Notifications** | ✅ **Full** | Resend API integration for application confirmation, status changes, recruiter invites, and interview bookings. | — |
| **Calendar File Integration** | ✅ **Full** | RFC 5545 standard `.ics` generator for Google Calendar, Outlook, and Apple Calendar. | — |
| **In-App Messaging / Recruiter-Candidate Q&A** | ❌ **Missing** | Communication is strictly one-way via automated email notifications. | **GAP:** No direct messaging thread between recruiter and applicant tied to a specific requisition. |
| **In-App Notification Bell & Center** | ❌ **Missing** | Notifications are only sent to external email inbox. | **GAP:** No dropdown notification bell in the top navbar showing real-time updates when an application changes stage. |

---

### 2.5 🏢 Employer Branding & Team Operations

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **Company Profile & Visual Identity** | ✅ **Full** | Logo, banner image, company description, website link, and industry categorization. | — |
| **Perks & Culture Badges** | ✅ **Full** | Standardized benefits library (Healthcare, 401k, Remote, etc.) saved on Company and Job postings. | — |
| **Public Company Page** | ✅ **Full** | Dynamic route `/companies/[slug]` displaying active requisitions, verification badges, and company story. | — |
| **Team Management & Recruiter Invitations** | ✅ **Full** | Invite team members by email, assign `RECRUITER` role, list active roster, and revoke access. | — |
| **KYC Entity Verification Badge** | ✅ **Full** | Platform admin verification workflow with cryptographic verification badge on job cards. | — |
| **Requisition Analytics & Funnel Metrics** | ⚠️ **Partial** | Basic metrics cards (Active Jobs, Total Applicants, Total Positions). | **GAP:** No view counts, click-through rates, applicant conversion percentage, or time-to-hire graphs. |

---

## 3. 🎯 Priority Implementation Plan for Missing Core Features

To bring the platform to **100% feature parity with top commercial job boards**, the missing features identified above should be implemented in the following sequence:

### 🥇 Priority Tier 1: Core ATS Screening & Candidate Experience Gaps
1. **Recruiter Private Screening Notes & 1–5 Star Scorecard:**
   - Entity: `ApplicationScreeningNote.java` (`id`, `application`, `author`, `rating` 1-5, `internalNote`, `createdAt`).
   - Private recruiter evaluation cards inside `ResumePreviewModal` without alerting the candidate.
2. **Job Custom Screening Questions:**
   - Requisition question definitions (`JobQuestion.java`) with answer submission (`ApplicationAnswer.java`).
   - Step in `ApplyJobModal` to answer required pre-screening criteria before submitting.
3. **Structured Work Experience & Education Timeline on Candidate Profile:**
   - Entities: `WorkExperience.java` and `EducationHistory.java`.
   - Rich profile editor tabs and screening drawer for recruiters.

### 🥈 Priority Tier 2: Recruiter Productivity & Engagement
4. **Candidate Job Alerts & Automated Email Digest (Phase 2):**
   - Background Spring Boot `@Scheduled` matching engine & Resend email digests.
5. **Bulk Applicant Actions & CSV Export:**
   - Multi-select checkbox toolbar in `EmployerApplicantsTable` to bulk update statuses or export CSV.
6. **In-App Notification Bell Center:**
   - Real-time notification feed in navbar for application updates, interview invites, and recruiter notes.

# 🗺️ Platform Development Roadmap & Core Feature Gap Analysis

This document outlines the architectural specifications, implemented systems, and comprehensive core feature gap analysis for the **JobPortal** full-stack ecosystem (Spring Boot 3 + Next.js 16 + PostgreSQL).

---

## 1. 🚀 Strategic Platform Milestones (Implementation Status)

| Phase | Feature Milestone | Status | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Interview Scheduling & Calendar Sync System** | ✅ **Completed** | Full RFC 5545 `.ics` generator, Resend meeting invites, recruiter scheduling modal, candidate countdown, and 1-click Google Calendar / Outlook sync |
| **Phase 2** | **Candidate Skills Match Scoring Engine** | ✅ **Completed** | Heuristic taxonomy matching, `90% Match` card badges, detailed breakdown matrix, and employer screening fit column |
| **Phase 3** | **Candidate Job Alerts & Automated Email Digest** | ✅ **Completed** | Background `@Scheduled` matching engine & automated weekly/daily digests via Resend |
| **Phase 4** | **In-App Notification Bell & Real-Time Alert Feed** | ✅ **Completed** | Navbar notification bell, unread badge counter, and automated alerts on status updates, interview invites, and applications |
| **Phase 5** | **1-Click Quick Apply & Requisition Funnel Analytics** | ✅ **Completed** | 1-Click application using profile resume, job view tracking, conversion rate calculation (`apps / views`), full candidate profile inspector, and rejection templates |

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
| **Custom Job Screening Questions** | ✅ **Full** | Employers can configure custom text, yes/no, and multiple-choice screening questions in create/edit modal. Candidates answer in `ApplyJobModal`, and answers are reviewed in recruiter `ResumePreviewModal` and `ApplicationDetailDrawer`. | — |
| **1-Click Quick Apply** | ✅ **Full** | Direct 1-Click apply on `/jobs/[slug]` using candidate's saved profile resume and contact info when no mandatory screening questions exist. | — |
| **Multiple Saved Resumes / Version Selector** | ✅ **Full** | `CandidateResume` entity, labeled versions (e.g., Backend CV, DevOps Lead), ImageKit CDN storage, auto-default synchronization, and interactive variant picker in `ApplyJobModal`. | — |

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
| **Private Internal Screening Notes & Rating** | ✅ **Full** | `ApplicationScreeningNote` entity, 1–5 star rating scorecard selector, confidential internal reviewer timeline, and average star rating badge on applicant rows. | — |
| **Direct Candidate Profile Inspector Tab** | ✅ **Full** | Built-in "Profile" tab inside `ResumePreviewModal` rendering candidate headline, bio, verified skills cloud, career experience timeline, and academic credentials. | — |
| **Bulk Applicant Actions & CSV Export** | ✅ **Full** | Multi-select checkbox toolbar in `EmployerApplicantsTable` allowing bulk shortlisting, bulk interviewing, bulk rejection, and 1-click formatted CSV applicant roster export. | — |
| **Structured Rejection Email Reason Templates** | ✅ **Full** | Quick-select dropdown selector in recruiter modal ("Position Filled", "Skills Specialization", "Experience Requirement", "Location / Timezone") automatically populating polite feedback notes. | — |

---

### 2.3 👤 Candidate Professional Profile & Career History

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **Basic Identity & Contact Details** | ✅ **Full** | Name, email, phone, location, avatar upload via ImageKit CDN. | — |
| **Headline & Professional Bio** | ✅ **Full** | Stored in `CandidateProfile.headline` and `CandidateProfile.bio`. | — |
| **Skill Cloud & Tags** | ✅ **Full** | Dynamic skill tags stored in `candidate_skills` collection table, used by the Skills Match Engine. | — |
| **Social & Portfolio Links** | ✅ **Full** | GitHub, LinkedIn, and personal website URLs. | — |
| **Structured Work Experience History** | ✅ **Full** | `WorkExperience` entity, interactive chronological timeline in `CandidateProfileView`, "Currently working" toggles, and REST CRUD endpoints. | — |
| **Structured Education & Degree Credentials** | ✅ **Full** | `EducationHistory` entity, academic credentials timeline in `CandidateProfileView`, degree/institution/GPA tracking, and REST CRUD endpoints. | — |
| **Certifications & Licensures** | ❌ **Missing** | Not supported in profile. | **GAP:** Cannot list AWS, Google Cloud, PMP, or other industry certifications. |

---

### 2.4 💬 Recruitment Communications & Interaction Loop

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **Transactional Email Notifications** | ✅ **Full** | Resend API integration for application confirmation, status changes, recruiter invites, and interview bookings. | — |
| **Calendar File Integration** | ✅ **Full** | RFC 5545 standard `.ics` generator for Google Calendar, Outlook, and Apple Calendar. | — |
| **In-App Notification Bell & Real-Time Alert Center** | ✅ **Full** | Navbar notification bell, unread badge counter, and automated alerts on status updates, interview invites, and applications (`/api/v1/notifications`). | — |
| **In-App Messaging / Recruiter-Candidate Q&A** | ❌ **Missing** | Communication is strictly one-way via automated notifications. | **GAP:** No direct messaging chat thread between recruiter and applicant tied to a specific requisition. |

---

### 2.5 🏢 Employer Branding & Team Operations

| Feature Capability | Status | Current Implementation Details | Gaps / Missing Capabilities |
| :--- | :---: | :--- | :--- |
| **Company Profile & Visual Identity** | ✅ **Full** | Logo, banner image, company description, website link, and industry categorization. | — |
| **Perks & Culture Badges** | ✅ **Full** | Standardized benefits library (Healthcare, 401k, Remote, etc.) saved on Company and Job postings. | — |
| **Public Company Page** | ✅ **Full** | Dynamic route `/companies/[slug]` displaying active requisitions, verification badges, and company story. | — |
| **Team Management & Recruiter Invitations** | ✅ **Full** | Invite team members by email, assign `RECRUITER` role, list active roster, and revoke access. | — |
| **KYC Entity Verification Badge** | ✅ **Full** | Platform admin verification workflow with cryptographic verification badge on job cards. | — |
| **Requisition View Tracking & Funnel Analytics** | ✅ **Full** | Unique view tracking on job requisitions (`Job.viewsCount`), total views metrics card, and application conversion rate funnel (`(applicants / views) * 100%`) in Employer Dashboard. | — |

---

## 3. 🔮 Planned Future Roadmap (Unimplemented Features to Implement Later)

The following advanced features represent the next major capabilities planned for future implementation sprints, expanding the platform into an enterprise-grade recruitment and employer brand operating system.

---

### 3.1 📊 Interactive Kanban ATS Pipeline Board (Ashby / Greenhouse Style)
* **Overview:** A visual, drag-and-drop recruitment pipeline view for corporate recruiters and hiring teams.
* **Key Requirements & Architecture:**
  * Multi-column board displaying applicant cards across all pipeline stages: `APPLIED` $\rightarrow$ `REVIEWING` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `INTERVIEWING` $\rightarrow$ `OFFERED` $\rightarrow$ `REJECTED`.
  * Drag-and-drop card interaction (powered by `@hello-pangea/dnd` or `@dnd-kit`) with instant optimistic stage movement.
  * Backend bulk and reorder endpoints updating application stages and audit trails in real time.
  * Per-column metrics (candidate counts, average stage velocity, conversion rates).
  * Quick-action triggers on card drop (e.g. dropping into `INTERVIEWING` prompts the interview scheduler modal; dropping into `REJECTED` opens structured rejection template).

---

### 3.2 💬 In-App Direct Recruiter-Candidate Messaging (Application Chat Thread)
* **Overview:** Seamless, real-time two-way communication between candidates and hiring managers tied directly to specific job applications.
* **Key Requirements & Architecture:**
  * `ApplicationMessage` entity linking `application_id`, `sender_id`, `recipient_id`, `content`, `attachment_url`, and `read_at` timestamps.
  * Real-time WebSocket / SSE connection or polling for instant message delivery without page reloads.
  * In-app chat drawer in both Candidate and Employer dashboards.
  * Email notification bridge via Resend API: if recipient is offline for $>15$ minutes, deliver an email alert with a direct deep-link to reply.
  * Support for secure document and assignment sharing (take-home projects, portfolios).

---

### 3.3 🔎 Candidate Sourcing & Reverse Talent Pool Search Directory
* **Overview:** Enables verified enterprise employers to proactively discover, filter, and reach out to top talent who have opted into the public talent pool.
* **Key Requirements & Architecture:**
  * Candidate privacy controls: `"Open to Opportunities"` profile toggle and privacy shields (ability to hide profile from current employer's company domain).
  * Recruiter talent discovery portal (`/candidates/search`) with multi-faceted search:
    * Skills matrix matching and boolean query parsing.
    * Experience range, preferred work mode (Remote/Hybrid/Onsite), and minimum target compensation.
    * Location / timezone matching.
  * Direct Recruiter Reachout: 1-click `"Invite to Apply"` or `"Send InMail"` mechanism linked directly to active open requisitions.
  * Sourcing funnel analytics: track reachout response rates and sourcing channel ROI.

---

### 3.4 📝 Multi-Interviewer Structured Hiring Scorecard & Rubrics
* **Overview:** Collaborative, unbiased candidate interview evaluation system for cross-functional hiring panels (engineering, design, product, culture).
* **Key Requirements & Architecture:**
  * Configurable evaluation rubrics per job requisition (e.g., *System Architecture*, *Live Coding*, *Team Leadership*, *Values Fit*).
  * Individual interviewer submission forms with weighted 1–5 scoring and concrete behavioral evidence fields.
  * Private score isolation: panel interviewers cannot see each other's scorecards until after submitting their own evaluation (eliminating groupthink bias).
  * Consolidated Hiring Committee Summary: average section scores, radar chart visualization, and final recommendation votes (`Strong Hire`, `Hire`, `No Hire`, `Strong No Hire`).

---

### 3.5 ⭐ Company Reviews & Interview Experience Insights (Glassdoor / Levels.fyi Style)
* **Overview:** Transparent employer ratings and interview insight repository providing social proof and realistic expectations for applicants.
* **Key Requirements & Architecture:**
  * `CompanyReview` entity with verified submission requirements (candidate must have applied or verified employee status).
  * Multi-dimensional rating criteria:
    * Culture & Values (1–5)
    * Compensation & Benefits (1–5)
    * Work/Life Balance & Remote Flexibility (1–5)
    * CEO Approval & Positive Business Outlook
  * Interview Experience Repository:
    * Overall interview difficulty rating (Easy $\rightarrow$ Hard).
    * Interview timeline length (e.g., 2 weeks, 4 rounds).
    * Sample interview questions and candidate outcome (Offer Accepted, Offer Declined, No Offer).
  * Moderation queue in Platform Admin dashboard to filter defamatory or non-compliant reviews.


# Retrieval-Augmented Generation (RAG) Architecture & Feature Guide

This document details the architecture, vector pipeline, API endpoints, and user-facing workflows of the **Retrieval-Augmented Generation (RAG)** system implemented in the GenAI-Powered Recruitment Platform.

---

## 1. Executive Architecture Overview

Traditional Large Language Models (LLMs) suffer from hallucinations and lack knowledge of real-time candidate updates or confidential resumes. The platform solves this by implementing an end-to-end **Retrieval-Augmented Generation (RAG)** pipeline powered by **Google Gemini** embeddings and vector similarity search.

```
Candidate Profile / Resume
       │
       ▼
Text Chunking Engine (Candidate Bio, Work History, Education, Skills, PDF text)
       │
       ▼
Gemini Embedding Model (768-dimensional dense vectors with deterministic fallback)
       │
       ▼
Vector Store / Relational In-Memory Index
       │
       ▼
Cosine Similarity Search ◄── Recruiter Query / Job Requisition Requirements
       │
       ▼
Top-K Relevant Chunks (Context)
       │
       ▼
Gemini Generative Model (Grounded, hallucination-free generation with citations)
```

---

## 2. Core RAG Features

### Feature 1: Recruiter Semantic Talent Pool Search
* **Endpoint**: `POST /api/v1/rag/talent-search`
* **Authorization**: `EMPLOYER_ADMIN`, `EMPLOYER_MEMBER`, `PLATFORM_ADMIN`
* **Purpose**: Allows technical recruiters to search talent using natural language queries rather than rigid keyword boolean filters.
* **How it works**:
  1. The recruiter submits a conversational query, e.g.:
     > *"Staff distributed systems engineer who has migrated telemetry pipelines with Kafka and Java 21"*
  2. The system embeds the query into a 768-dimensional vector.
  3. Computes cosine similarity against all indexed candidate profile chunks.
  4. Returns ranked candidates with confidence scores, matching highlights, and specific strengths.
* **Frontend Component**: `<TalentSearchCopilot />`
  * **File**: `client/src/features/rag/components/talent-search-copilot.tsx`
  * **Location**: Mounted directly on the Employer Dashboard (`client/src/features/dashboard/employer/components/employer-dashboard-view.tsx`).

---

### Feature 2: Grounded Job-to-Resume Fit Analysis
* **Endpoint**: `GET /api/v1/rag/jobs/{jobId}/fit?candidateId={candidateId}`
* **Authorization**: Authenticated Candidates & Employers
* **Purpose**: Objectively compares a candidate’s career background directly against specific job requisition criteria.
* **How it works**:
  1. Evaluates the requisition description, responsibilities, and required skill tags.
  2. Queries the vector store to extract the top-K most relevant chunks from the target candidate's resume/profile.
  3. Synthesizes a structured evaluation containing:
     - **Fit Score** (0–100%)
     - **Matched Qualifications** (grounded in the candidate's actual history)
     - **Missing Skills / Experience Gaps**
     - **Tailored Interview Prep Advice**
* **Frontend Component**: `<GroundedJobFitModal />`
  * **File**: `client/src/features/rag/components/grounded-job-fit-modal.tsx`
  * **Location**: Accessible from the Job Detail view (`client/src/features/jobs/components/job-detail-view.tsx`).

---

### Feature 3: Candidate Resume Bullet-Point Optimizer
* **Endpoint**: `POST /api/v1/rag/optimize-bullet`
* **Authorization**: Authenticated Candidates (`PRO` tier feature)
* **Purpose**: Helps candidates craft high-impact resume bullet points that satisfy modern Applicant Tracking Systems (ATS) and hiring bars.
* **How it works**:
  1. Candidate inputs an unpolished bullet (e.g., *"Worked on improving the database"*).
  2. Evaluates the input against the **Google XYZ formula** (*"Accomplished [X] as measured by [Y], by doing [Z]"*) and the **STAR method** (Situation, Task, Action, Result).
  3. Returns 3 leveled suggestions (Standard, High-Impact, Executive/Staff), identifying strong action verbs, quantifiable metrics, and technical depth.
* **Frontend Component**: `<ResumeBulletOptimizer />`
  * **File**: `client/src/features/rag/components/resume-bullet-optimizer.tsx`
  * **Location**: Integrated into the Candidate Dashboard view (`client/src/features/dashboard/candidate/components/candidate-dashboard-view.tsx`).

---

### Feature 4: Recruiter "Chat with Candidate Resume"
* **Endpoint**: `POST /api/v1/rag/candidates/{candidateId}/chat`
* **Authorization**: `EMPLOYER_ADMIN`, `EMPLOYER_MEMBER`, `PLATFORM_ADMIN`
* **Purpose**: Interactive Q&A for recruiters inspecting candidate applications.
* **How it works**:
  1. The recruiter asks a question about the candidate (e.g., *"Does this candidate have experience leading incident response for production Kubernetes clusters?"*).
  2. The question is embedded and matched against the specific candidate's resume chunks.
  3. The LLM generates a factual, grounded answer with direct citations to the relevant work history or project entry.
  4. If the information is not present in the candidate's history, the model explicitly states it is not mentioned, preventing false positives.
* **Frontend Component**: `<ResumeChatDrawer />` & `rag-chat` tab in `<ResumePreviewModal />`
  * **File**: `client/src/features/rag/components/resume-chat-drawer.tsx`
  * **Location**: Application inspector review modal (`client/src/features/applications/components/resume-preview-modal.tsx`).

---

## 3. Data Ingestion & Chunking Pipeline

### Profile Chunking (`indexCandidateProfile`)
When a candidate profile is created, updated, or seeded, the system runs chunking across five distinct segments:
1. **Headline & Summary**: Role identity, career level, and professional summary.
2. **Work Experience**: Each role (company, title, dates, impact description) is indexed as an individual chunk.
3. **Education & Certifications**: University degrees, fields of study, and academic honors.
4. **Verified Skills**: Categorized technical skills, frameworks, and tools.
5. **PDF Resume Text (`indexResumeText`)**: Extracted text from uploaded PDF resumes chunked with contextual overlap.

---

## 4. Codebase Reference Map

### Backend (Spring Boot 4 / Java 21)
| Layer | File / Location | Description |
| :--- | :--- | :--- |
| **Controller** | `job-portal/src/main/java/com/example/job_portal/controller/ResumeRagController.java` | REST endpoints for RAG operations |
| **Service Interface** | `job-portal/src/main/java/com/example/job_portal/service/ai/ResumeRagService.java` | Service contract |
| **Implementation** | `job-portal/src/main/java/com/example/job_portal/service/ai/ResumeRagServiceImpl.java` | Chunking, cosine similarity, prompt engineering |
| **AI Client** | `job-portal/src/main/java/com/example/job_portal/service/ai/GeminiServiceImpl.java` | Google Gemini API integration and fallback vectors |
| **DTOs** | `job-portal/src/main/java/com/example/job_portal/dto/rag/*` | Request & response payload schemas |
| **Database Seeder**| `job-portal/src/main/java/com/example/job_portal/config/DatabaseSeeder.java` | Automatically indexes seeded candidate profiles |

### Frontend (Next.js / React / TypeScript)
| Feature | File / Location | Description |
| :--- | :--- | :--- |
| **API Client** | `client/src/features/rag/api/rag-api.ts` | Axios / Fetch wrapper for `/api/v1/rag/*` |
| **React Query Hooks**| `client/src/features/rag/hooks/use-rag.ts` | Mutations & queries for UI state management |
| **Types** | `client/src/features/rag/types/rag.ts` | TypeScript interface definitions |
| **Talent Copilot** | `client/src/features/rag/components/talent-search-copilot.tsx` | Recruiter conversational search interface |
| **Job Fit Modal** | `client/src/features/rag/components/grounded-job-fit-modal.tsx` | Grounded resume-to-job fit comparison |
| **Bullet Optimizer**| `client/src/features/rag/components/resume-bullet-optimizer.tsx` | STAR / Google XYZ impact editor |
| **Resume Chat** | `client/src/features/rag/components/resume-chat-drawer.tsx` | Recruiter Q&A drawer |

---

## 5. Seeded Test Candidates with RAG Vectors

The following pre-seeded test candidates have full career timelines, skills, and indexed vector chunks ready for evaluation:

| Candidate | Role & Plan | Credentials | Dedicated PDF Resume | Indexed Chunks |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Chen** | Senior Distributed Systems Engineer (`PRO`) | `alex.chen@gmail.com` / `Password123!` | `/resumes/alex-chen-resume.pdf` | 6 Chunks |
| **Priya Patel** | Senior Product & Frontend Engineer (`PRO`) | `priya.patel@gmail.com` / `Password123!` | `/resumes/priya-patel-resume.pdf` | 5 Chunks |
| **Marcus Vance** | Staff Cloud & Kubernetes Architect (`PRO`) | `marcus.vance@gmail.com` / `Password123!` | `/resumes/marcus-vance-resume.pdf` | 5 Chunks |
| **Elena Rostova** | Lead Mobile Engineer (`PRO`) | `elena.rostova@gmail.com` / `Password123!` | `/resumes/elena-rostova-resume.pdf` | 5 Chunks |
| **David Kim** | Staff ML Platform Engineer (`PRO`) | `david.kim@gmail.com` / `Password123!` | `/resumes/david-kim-resume.pdf` | 6 Chunks |
| **Leo Torres** | Junior Full Stack Developer (`FREE`) | `leo.torres@gmail.com` / `Password123!` | `/resumes/leo-torres-resume.pdf` | 4 Chunks |

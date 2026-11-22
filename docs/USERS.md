# Platform Users, Test Accounts & Credentials Directory

This document lists all pre-seeded user accounts, employer profiles, candidates, and administrative credentials available in the database.

> [!NOTE]
> All pre-seeded accounts share the same default password: **`Password123!`**  
> All candidate resumes are hosted on ImageKit CDN and can be accessed or downloaded directly.

---

## 1. Quick Credentials Lookup Table

| Name | Role | Email | Password | Tier / Status | Test Focus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Platform Administrator** | `PLATFORM_ADMIN` | `admin@jobportal.com` | `Password123!` | Active Admin | KYC Approval, Scam Quarantine, User Bans |
| **Sarah Jenkins (Stripe)** | `EMPLOYER_ADMIN` | `sarah.jenkins@stripe.com` | `Password123!` | `ENTERPRISE` (Verified) | Enterprise job posting, interview pipeline |
| **Tuomas Artman (Linear)** | `EMPLOYER_ADMIN` | `tuomas@linear.app` | `Password123!` | `GROWTH` (Verified) | Active job offers, candidate evaluations |
| **Guillermo Rauch (Vercel)** | `EMPLOYER_ADMIN` | `rauchg@vercel.com` | `Password123!` | `ENTERPRISE` (Verified) | Shortlisting candidates, technical criteria |
| **Claire Wilson (Monzo)** | `EMPLOYER_ADMIN` | `claire.wilson@monzo.com` | `Password123!` | `GROWTH` (Verified) | Application screening notes & scorecards |
| **Olivier Pomel (Datadog)** | `EMPLOYER_ADMIN` | `olivier.pomel@datadog.com` | `Password123!` | `ENTERPRISE` (Verified) | AI Observability job matching |
| **Paul Copplestone (Supabase)** | `EMPLOYER_ADMIN` | `paul.copplestone@supabase.com` | `Password123!` | `FREE` (Verified) | Free tier 2-job posting limit |
| **Zeno Rocha (Resend)** | `EMPLOYER_ADMIN` | `zeno.rocha@resend.com` | `Password123!` | `FREE` (Verified) | Free tier job posting & upgrade banner |
| **James Hawkins (PostHog)** | `EMPLOYER_ADMIN` | `james.hawkins@posthog.com` | `Password123!` | `FREE` (**`PENDING KYC`**) | **Admin KYC verification testing** |
| **Alex Chen** | `CANDIDATE` | `alex.chen@gmail.com` | `Password123!` | `PRO` (Active) | Interview scheduled with Stripe |
| **Priya Patel** | `CANDIDATE` | `priya.patel@gmail.com` | `Password123!` | `PRO` (Active) | Formal Job Offer extended by Linear |
| **Marcus Vance** | `CANDIDATE` | `marcus.vance@gmail.com` | `Password123!` | `PRO` (Active) | Shortlisted at Vercel |
| **Elena Rostova** | `CANDIDATE` | `elena.rostova@gmail.com` | `Password123!` | `PRO` (Active) | Under review at Monzo Bank |
| **David Kim** | `CANDIDATE` | `david.kim@gmail.com` | `Password123!` | `PRO` (Active) | Applied at Datadog |
| **Leo Torres** | `CANDIDATE` | `leo.torres@gmail.com` | `Password123!` | `FREE` (Active) | Free plan limits (max 2 resumes, paywall) |
| **Jonathan Vance** | `CANDIDATE` | `audit.security.candidate@tempmail.org` | `Password123!` | `FREE` (Flagged) | Resume tampering / prompt injection audit |

---

## 2. Platform Administration

### Platform Security Administrator
- **Email**: `admin@jobportal.com`
- **Password**: `Password123!`
- **Role**: `PLATFORM_ADMIN`
- **Dashboard URL**: `/dashboard/admin`
- **Key Capabilities**:
  - **KYC Verification Queue**: Approve or reject newly registered employer organizations (e.g. review PostHog).
  - **AI Trust & Scam Quarantine**: Review and release/delete fraudulent listings detected by Gemini AI.
  - **User Governance**: Moderation dashboard with ban/unban controls and compliance audit notes.
  - **System Telemetry**: Infrastructure health, database connections, and revenue analytics.

---

## 3. Employer Accounts (Hiring Teams)

### 3.1 Paid Employers (Growth & Enterprise Tiers)

#### Stripe
- **Hiring Lead**: Sarah Jenkins (`sarah.jenkins@stripe.com`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.ENTERPRISE` (Unlimited job postings, 0% commission, AI auto-screening)
- **Active Job**: *Staff Distributed Systems Engineer - Core Transaction Ledger*
- **Active Application**: Alex Chen (`INTERVIEWING` stage with Google Meet interview link)

#### Linear
- **Hiring Lead**: Tuomas Artman (`tuomas@linear.app`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.GROWTH` (10 active job slots, priority candidate indexing)
- **Active Job**: *Senior Full Stack Product Engineer - Cycles & Sync*
- **Active Application**: Priya Patel (`OFFERED` stage with an extended formal offer letter)

#### Vercel
- **Hiring Lead**: Guillermo Rauch (`rauchg@vercel.com`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.ENTERPRISE`
- **Active Job**: *Principal Cloud Infrastructure Architect - Edge Network*
- **Active Application**: Marcus Vance (`SHORTLISTED` stage)

#### Monzo Bank
- **Hiring Lead**: Claire Wilson (`claire.wilson@monzo.com`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.GROWTH`
- **Active Job**: *Lead Mobile Engineer - Payments & Identity*
- **Active Application**: Elena Rostova (`REVIEWING` stage)

#### Datadog
- **Hiring Lead**: Olivier Pomel (`olivier.pomel@datadog.com`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.ENTERPRISE`
- **Active Job**: *Staff Machine Learning Engineer - AI Observability*
- **Active Application**: David Kim (`APPLIED` stage)

---

### 3.2 Free Tier Employers

#### Supabase
- **Hiring Lead**: Paul Copplestone (`paul.copplestone@supabase.com`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.FREE` (Verified, capped at 2 active job postings)
- **Active Job**: *Senior Backend Engineer - Storage & Realtime*

#### Resend
- **Hiring Lead**: Zeno Rocha (`zeno.rocha@resend.com`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.FREE` (Verified, capped at 2 active job postings)
- **Active Job**: *Developer Experience Engineer - SDKs & Docs*

---

### 3.3 Company Under Verification (`PENDING KYC`)

#### PostHog
- **Hiring Lead**: James Hawkins (`james.hawkins@posthog.com`)
- **Password**: `Password123!`
- **Company Tier**: `SubscriptionPlan.FREE`
- **Status**: **`PENDING`** (`verifiedAt = null`)
- **Test Use Case**: Log in as `admin@jobportal.com`, visit the **KYC Verification Queue** tab, and approve or reject PostHog.

---

## 4. Candidate Profiles & Resumes

All candidate resumes are hosted on ImageKit CDN and can be viewed directly in browser or embedded in the candidate application review drawer.

### 4.1 Pro Tier Candidates (`CandidatePlan.PRO`)

#### Alex Chen
- **Email**: `alex.chen@gmail.com` | **Password**: `Password123!`
- **Headline**: Staff Distributed Systems Engineer | Java 21, Kafka, Raft & Virtual Threads
- **Resume CDN**: [alex-chen-resume.pdf](https://ik.imagekit.io/ic07orwae/resumes/alex-chen-resume.pdf)
- **Status**: Scheduled System Architecture Interview with Stripe Core Ledger.

#### Priya Patel
- **Email**: `priya.patel@gmail.com` | **Password**: `Password123!`
- **Headline**: Senior Full Stack Product Engineer | Next.js, TypeScript, GraphQL & Design Systems
- **Resume CDN**: [priya-patel-resume.pdf](https://ik.imagekit.io/ic07orwae/resumes/priya-patel-resume.pdf)
- **Status**: Extended formal job offer from Linear (£120,000 + 0.18% ISO stock options).
- **Offer Sign URL**: `/offers/sign/linear-offer-sig-token-priya-patel-2026`

#### Marcus Vance
- **Email**: `marcus.vance@gmail.com` | **Password**: `Password123!`
- **Headline**: Principal Cloud Infrastructure Architect & SRE Lead | Terraform, Kubernetes, Anycast
- **Resume CDN**: [marcus-vance-resume.pdf](https://ik.imagekit.io/ic07orwae/resumes/marcus-vance-resume.pdf)
- **Status**: Shortlisted for Vercel Edge Network.

#### Elena Rostova
- **Email**: `elena.rostova@gmail.com` | **Password**: `Password123!`
- **Headline**: Lead Mobile Engineer | iOS (Swift), Android (Kotlin), React Native & Biometrics
- **Resume CDN**: [elena-rostova-resume.pdf](https://ik.imagekit.io/ic07orwae/resumes/elena-rostova-resume.pdf)
- **Status**: Application in review at Monzo Bank.

#### David Kim
- **Email**: `david.kim@gmail.com` | **Password**: `Password123!`
- **Headline**: Staff Machine Learning Engineer | LLM Inference, PyTorch & Vector Search
- **Resume CDN**: [david-kim-resume.pdf](https://ik.imagekit.io/ic07orwae/resumes/david-kim-resume.pdf)
- **Status**: Applied for Datadog AI Observability.

---

### 4.2 Free Tier Candidate (`CandidatePlan.FREE`)

#### Leo Torres
- **Email**: `leo.torres@gmail.com` | **Password**: `Password123!`
- **Headline**: Junior Full Stack Developer | React, TypeScript, Next.js & Node.js
- **Resume CDN**: [leo-torres-resume.pdf](https://ik.imagekit.io/ic07orwae/resumes/leo-torres-resume.pdf)
- **Plan Constraints**:
  - Maximum 2 uploaded resume versions.
  - Locked AI Resume Optimizer (triggers Upgrade to Pro banner).
  - Standard application matching priority.

---

### 4.3 Security & Adversarial Test Candidate

#### Jonathan Vance (Security Audit Sample)
- **Email**: `audit.security.candidate@tempmail.org` | **Password**: `Password123!`
- **Headline**: Software Quality Assurance Engineer & Data Systems Specialist
- **Resume CDN**: [jonathan-vance-resume.pdf](https://ik.imagekit.io/ic07orwae/resumes/jonathan-vance-resume.pdf)
- **Test Focus**: Resume containing prompt injection tokens and hidden white text; flagged with an anomaly score of **88% CRITICAL** by the AI security scanner.

---

## 5. End-to-End Walkthrough Scenarios

### Scenario A: Testing Admin KYC Verification
1. Sign in as `admin@jobportal.com` (`Password123!`).
2. Navigate to `/dashboard/admin`.
3. In the **KYC Verification Queue** tab, filter by **"Pending KYC"**.
4. Locate **PostHog** (`james.hawkins@posthog.com`).
5. Click **"Verify Entity"** to approve PostHog, or **"Reject"** to test entering a rejection justification.

### Scenario B: Testing Digital Job Offer Acceptance
1. Sign in as `priya.patel@gmail.com` (`Password123!`).
2. Visit `/offers/sign/linear-offer-sig-token-priya-patel-2026` or open notifications.
3. Review Linear's £120,000 compensation breakdown, ISO equity details, and benefits summary.
4. Sign the offer using the digital signature pad.

### Scenario C: Testing Free Tier Candidate Limitations
1. Sign in as `leo.torres@gmail.com` (`Password123!`).
2. Navigate to `/dashboard/candidate/resumes`.
3. Notice the 2-resume limit indicator and the Pro upgrade prompt when attempting to trigger the AI resume bullet optimizer.

### Scenario D: Testing Employer Job Posting Limits
1. Sign in as `paul.copplestone@supabase.com` or `zeno.rocha@resend.com` (`Password123!`).
2. Go to `/dashboard/employer/jobs/new`.
3. Notice the Free tier badge: maximum 2 active job postings allowed before prompting an upgrade to Growth or Enterprise.

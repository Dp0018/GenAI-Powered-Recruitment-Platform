-- ============================================================================
-- JOB PORTAL - ENTERPRISE SEED DATASET (PROPER MOCK DATA)
-- ============================================================================
-- Description: Comprehensive, production-grade seed script containing 4 complete
--              companies, 4 employers, 4 candidates with full profiles and experience,
--              4 detailed jobs with screening questions, and 4 applications across
--              different hiring stages (Reviewing, Shortlisted, Interview, Offer).
--
-- NOTE: Passwords for all seeded user accounts is: "Password123!"
--       BCrypt Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--
-- DO NOT EXECUTE AUTOMATICALLY.
-- Run manually whenever you want to populate mock data:
-- psql -U postgres -d job_portal -f seed-data.sql
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. COMPANIES (4 Distinct Verified Tech Companies)
-- ----------------------------------------------------------------------------

-- Company 1: Stripe (Fintech Infrastructure)
INSERT INTO companies (id, name, slug, website, industry, company_size, location, description, verification_status, verified_at, created_at, updated_at)
VALUES (
    'c0000001-0000-0000-0000-000000000001',
    'Stripe',
    'stripe',
    'https://stripe.com',
    'Financial Technology',
    '5000+ employees',
    'San Francisco, CA & Remote',
    'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their businesses online.',
    'VERIFIED',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Company 2: Linear (Productivity & Issue Tracking)
INSERT INTO companies (id, name, slug, website, industry, company_size, location, description, verification_status, verified_at, created_at, updated_at)
VALUES (
    'c0000002-0000-0000-0000-000000000002',
    'Linear',
    'linear',
    'https://linear.app',
    'Developer Tools & Software',
    '50-200 employees',
    'San Francisco, CA & London, UK',
    'Linear is the modern standard for issue tracking, cycle management, and product roadmaps. Built for high-performance software teams.',
    'VERIFIED',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Company 3: Vercel (Frontend Cloud Platform)
INSERT INTO companies (id, name, slug, website, industry, company_size, location, description, verification_status, verified_at, created_at, updated_at)
VALUES (
    'c0000003-0000-0000-0000-000000000003',
    'Vercel',
    'vercel',
    'https://vercel.com',
    'Cloud Computing & DevOps',
    '500-1000 employees',
    'Remote Worldwide',
    'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. Creators of Next.js.',
    'VERIFIED',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Company 4: Monzo (Digital Banking)
INSERT INTO companies (id, name, slug, website, industry, company_size, location, description, verification_status, verified_at, created_at, updated_at)
VALUES (
    'c0000004-0000-0000-0000-000000000004',
    'Monzo Bank',
    'monzo-bank',
    'https://monzo.com',
    'Fintech & Digital Banking',
    '2000-5000 employees',
    'London, United Kingdom',
    'Monzo is making money work for everyone. We are a fully licensed UK digital bank built on a cloud-native microservices architecture in Go.',
    'VERIFIED',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2. USERS & CREDENTIAL ACCOUNTS (4 Employers, 4 Candidates, 1 Admin)
-- ----------------------------------------------------------------------------

-- 2.1 Platform Admin
INSERT INTO users (id, name, email, email_verified, role, banned, created_at, updated_at)
VALUES (
    'u0000000-0000-0000-0000-000000000000',
    'Platform Administrator',
    'admin@jobportal.com',
    TRUE,
    'PLATFORM_ADMIN',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000000',
    'u0000000-0000-0000-0000-000000000000',
    'credential',
    'u0000000-0000-0000-0000-000000000000',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.2 Employer Admin 1: Stripe (Sarah Jenkins)
INSERT INTO users (id, name, email, email_verified, role, company_id, banned, created_at, updated_at)
VALUES (
    'u0000001-0000-0000-0000-000000000001',
    'Sarah Jenkins',
    'sarah.jenkins@stripe.com',
    TRUE,
    'EMPLOYER_ADMIN',
    'c0000001-0000-0000-0000-000000000001',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000001-0000-0000-0000-000000000001',
    'u0000001-0000-0000-0000-000000000001',
    'credential',
    'u0000001-0000-0000-0000-000000000001',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.3 Employer Admin 2: Linear (Tuomas Artman)
INSERT INTO users (id, name, email, email_verified, role, company_id, banned, created_at, updated_at)
VALUES (
    'u0000002-0000-0000-0000-000000000002',
    'Tuomas Artman',
    'tuomas@linear.app',
    TRUE,
    'EMPLOYER_ADMIN',
    'c0000002-0000-0000-0000-000000000002',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000002-0000-0000-0000-000000000002',
    'u0000002-0000-0000-0000-000000000002',
    'credential',
    'u0000002-0000-0000-0000-000000000002',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.4 Employer Admin 3: Vercel (Guillermo Rauch)
INSERT INTO users (id, name, email, email_verified, role, company_id, banned, created_at, updated_at)
VALUES (
    'u0000003-0000-0000-0000-000000000003',
    'Guillermo Rauch',
    'rauchg@vercel.com',
    TRUE,
    'EMPLOYER_ADMIN',
    'c0000003-0000-0000-0000-000000000003',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000003-0000-0000-0000-000000000003',
    'u0000003-0000-0000-0000-000000000003',
    'credential',
    'u0000003-0000-0000-0000-000000000003',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.5 Employer Admin 4: Monzo (Claire Wilson)
INSERT INTO users (id, name, email, email_verified, role, company_id, banned, created_at, updated_at)
VALUES (
    'u0000004-0000-0000-0000-000000000004',
    'Claire Wilson',
    'claire.wilson@monzo.com',
    TRUE,
    'EMPLOYER_ADMIN',
    'c0000004-0000-0000-0000-000000000004',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000004-0000-0000-0000-000000000004',
    'u0000004-0000-0000-0000-000000000004',
    'credential',
    'u0000004-0000-0000-0000-000000000004',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.6 Candidate 1: Alex Chen
INSERT INTO users (id, name, email, email_verified, role, phone, banned, created_at, updated_at)
VALUES (
    'u0000011-0000-0000-0000-000000000011',
    'Alex Chen',
    'alex.chen@gmail.com',
    TRUE,
    'CANDIDATE',
    '+44 7700 900123',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000011-0000-0000-0000-000000000011',
    'u0000011-0000-0000-0000-000000000011',
    'credential',
    'u0000011-0000-0000-0000-000000000011',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.7 Candidate 2: Priya Patel
INSERT INTO users (id, name, email, email_verified, role, phone, banned, created_at, updated_at)
VALUES (
    'u0000012-0000-0000-0000-000000000012',
    'Priya Patel',
    'priya.patel@gmail.com',
    TRUE,
    'CANDIDATE',
    '+44 7700 900456',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000012-0000-0000-0000-000000000012',
    'u0000012-0000-0000-0000-000000000012',
    'credential',
    'u0000012-0000-0000-0000-000000000012',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.8 Candidate 3: Marcus Vance
INSERT INTO users (id, name, email, email_verified, role, phone, banned, created_at, updated_at)
VALUES (
    'u0000013-0000-0000-0000-000000000013',
    'Marcus Vance',
    'marcus.vance@gmail.com',
    TRUE,
    'CANDIDATE',
    '+1 415 555 0192',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000013-0000-0000-0000-000000000013',
    'u0000013-0000-0000-0000-000000000013',
    'credential',
    'u0000013-0000-0000-0000-000000000013',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2.9 Candidate 4: Elena Rostova
INSERT INTO users (id, name, email, email_verified, role, phone, banned, created_at, updated_at)
VALUES (
    'u0000014-0000-0000-0000-000000000014',
    'Elena Rostova',
    'elena.rostova@gmail.com',
    TRUE,
    'CANDIDATE',
    '+44 7700 900888',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
VALUES (
    'a0000014-0000-0000-0000-000000000014',
    'u0000014-0000-0000-0000-000000000014',
    'credential',
    'u0000014-0000-0000-0000-000000000014',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 3. CANDIDATE PROFILES & EXPERIENCES
-- ----------------------------------------------------------------------------

-- Profile 1: Alex Chen
INSERT INTO candidate_profiles (id, user_id, headline, bio, location, website_url, github_url, linkedin_url, resume_url, resume_file_name, created_at, updated_at)
VALUES (
    'p0000001-0000-0000-0000-000000000001',
    'u0000011-0000-0000-0000-000000000011',
    'Staff Distributed Systems Engineer | ex-Datadog | Java, Go & Kafka',
    'Experienced backend systems engineer with 8+ years designing high-throughput transaction pipelines, Raft consensus protocols, and mission-critical cloud backends processing 200k+ ops/sec.',
    'London, UK (Remote / Hybrid)',
    'https://alexchen.dev',
    'https://github.com/alexchen-dev',
    'https://linkedin.com/in/alexchen-distributed',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Alex_Chen_Staff_Systems_Resume.pdf',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO candidate_skills (profile_id, skill) VALUES
('p0000001-0000-0000-0000-000000000001', 'Java 21'),
('p0000001-0000-0000-0000-000000000001', 'Spring Boot'),
('p0000001-0000-0000-0000-000000000001', 'Go'),
('p0000001-0000-0000-0000-000000000001', 'Kafka'),
('p0000001-0000-0000-0000-000000000001', 'Distributed Systems'),
('p0000001-0000-0000-0000-000000000001', 'PostgreSQL'),
('p0000001-0000-0000-0000-000000000001', 'Kubernetes'),
('p0000001-0000-0000-0000-000000000001', 'AWS');

INSERT INTO candidate_work_experiences (id, profile_id, company, title, location, start_date, end_date, currently_working, description)
VALUES (
    'w0000001-0000-0000-0000-000000000001',
    'p0000001-0000-0000-0000-000000000001',
    'Datadog',
    'Senior Distributed Systems Engineer',
    'London, UK',
    '2021-03',
    NULL,
    TRUE,
    'Architected real-time metrics aggregation pipeline ingesting 15TB daily. Reduced latency by 42% using zero-allocation Java and Netty.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO candidate_education_history (id, profile_id, institution, degree, field_of_study, start_date, end_date)
VALUES (
    'e0000001-0000-0000-0000-000000000001',
    'p0000001-0000-0000-0000-000000000001',
    'Imperial College London',
    'Master of Science (MSc)',
    'Distributed Software Systems',
    '2015-09',
    '2016-09'
) ON CONFLICT (id) DO NOTHING;

-- Profile 2: Priya Patel
INSERT INTO candidate_profiles (id, user_id, headline, bio, location, website_url, github_url, linkedin_url, resume_url, resume_file_name, created_at, updated_at)
VALUES (
    'p0000002-0000-0000-0000-000000000002',
    'u0000012-0000-0000-0000-000000000012',
    'Senior Full Stack Engineer | Next.js, TypeScript, GraphQL & Node.js',
    'Passionate product engineer with 6+ years building pixel-perfect, highly responsive consumer and B2B SaaS web applications. Strong advocate for design systems, accessible UI, and serverless compute.',
    'Bristol, UK',
    'https://priyapatel.tech',
    'https://github.com/priyapatel-tech',
    'https://linkedin.com/in/priya-patel-fullstack',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Priya_Patel_Senior_FullStack_Resume.pdf',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO candidate_skills (profile_id, skill) VALUES
('p0000002-0000-0000-0000-000000000002', 'Next.js'),
('p0000002-0000-0000-0000-000000000002', 'TypeScript'),
('p0000002-0000-0000-0000-000000000002', 'React'),
('p0000002-0000-0000-0000-000000000002', 'GraphQL'),
('p0000002-0000-0000-0000-000000000002', 'Node.js'),
('p0000002-0000-0000-0000-000000000002', 'TailwindCSS'),
('p0000002-0000-0000-0000-000000000002', 'PostgreSQL');

INSERT INTO candidate_work_experiences (id, profile_id, company, title, location, start_date, end_date, currently_working, description)
VALUES (
    'w0000002-0000-0000-0000-000000000002',
    'p0000002-0000-0000-0000-000000000002',
    'Wise',
    'Senior Product Engineer',
    'London, UK',
    '2022-01',
    NULL,
    TRUE,
    'Built international payments transfer dashboard with Next.js and TypeScript.'
) ON CONFLICT (id) DO NOTHING;

-- Profile 3: Marcus Vance
INSERT INTO candidate_profiles (id, user_id, headline, bio, location, website_url, github_url, linkedin_url, resume_url, resume_file_name, created_at, updated_at)
VALUES (
    'p0000003-0000-0000-0000-000000000003',
    'u0000013-0000-0000-0000-000000000013',
    'Principal Cloud Architect & SRE Lead | Terraform, Kubernetes, Multi-Cloud',
    'Cloud infrastructure specialist with 9 years managing 99.999% availability platforms, zero-downtime global multi-region failover, and infrastructure as code automation.',
    'San Francisco, CA (Remote)',
    'https://marcusvance.cloud',
    'https://github.com/marcusvance-cloud',
    'https://linkedin.com/in/marcusvance-sre',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Marcus_Vance_Cloud_Architect.pdf',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO candidate_skills (profile_id, skill) VALUES
('p0000003-0000-0000-0000-000000000003', 'Kubernetes'),
('p0000003-0000-0000-0000-000000000003', 'Terraform'),
('p0000003-0000-0000-0000-000000000003', 'AWS'),
('p0000003-0000-0000-0000-000000000003', 'GCP'),
('p0000003-0000-0000-0000-000000000003', 'Docker'),
('p0000003-0000-0000-0000-000000000003', 'Prometheus');

-- Profile 4: Elena Rostova
INSERT INTO candidate_profiles (id, user_id, headline, bio, location, website_url, github_url, linkedin_url, resume_url, resume_file_name, created_at, updated_at)
VALUES (
    'p0000004-0000-0000-0000-000000000004',
    'u0000014-0000-0000-0000-000000000014',
    'Lead Mobile Engineer | React Native, iOS (Swift), Android (Kotlin)',
    'Senior mobile architect delivering fluid 60fps applications for fintech and banking. Led teams of 8+ engineers shipping to millions of daily active users.',
    'London, UK',
    'https://elenarostova.dev',
    'https://github.com/elena-mobile',
    'https://linkedin.com/in/elena-rostova-mobile',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Elena_Rostova_Lead_Mobile_Resume.pdf',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO candidate_skills (profile_id, skill) VALUES
('p0000004-0000-0000-0000-000000000004', 'React Native'),
('p0000004-0000-0000-0000-000000000004', 'iOS'),
('p0000004-0000-0000-0000-000000000004', 'Swift'),
('p0000004-0000-0000-0000-000000000004', 'Kotlin'),
('p0000004-0000-0000-0000-000000000004', 'TypeScript'),
('p0000004-0000-0000-0000-000000000004', 'Mobile Security');


-- ----------------------------------------------------------------------------
-- 4. JOBS (4 Diverse Openings with Custom Timelines: 17d, 30d, 7d, 2d)
-- ----------------------------------------------------------------------------

-- Job 1: Stripe - Staff Distributed Systems Engineer (17 Days Close Timeline)
INSERT INTO jobs (id, company_id, title, slug, description, requirements, location, workplace_type, job_type, experience_level, min_salary, max_salary, currency, salary_period, has_equity, equity_range, has_sign_on_bonus, sign_on_bonus, annual_bonus_percentage, compensation_notes, expires_at, status, applicant_count, views_count, fraud_risk_score, fraud_risk_level, created_at, updated_at)
VALUES (
    'j0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    'Staff Distributed Systems Engineer - Core Ledger',
    'staff-distributed-systems-engineer-core-ledger',
    '<p>We are looking for a <strong>Staff Distributed Systems Engineer</strong> to lead the core transaction ledger team at Stripe. You will architect distributed consensus layers, guarantee immutable event sequencing, and operate fault-tolerant state machines at global financial scale.</p>',
    '• 7+ years building high-throughput distributed systems in Java, Go, or Rust\n• Deep understanding of distributed transactions, Paxos/Raft consensus, and storage engines\n• Experience operating Kafka, CockroachDB, or Cassandra in production',
    'Remote (UK / Europe Timezones)',
    'REMOTE',
    'FULL_TIME',
    'LEAD',
    140000,
    185000,
    'GBP',
    'YEARLY',
    TRUE,
    '0.15% - 0.35% Equity',
    TRUE,
    20000,
    15,
    'Calibrated based on technical depth, leadership scope, and verified engineering experience.',
    NOW() + INTERVAL '17 days',
    'PUBLISHED',
    1,
    284,
    0,
    'LOW',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO job_tags (job_id, tag) VALUES
('j0000001-0000-0000-0000-000000000001', 'Java 21'),
('j0000001-0000-0000-0000-000000000001', 'Distributed Systems'),
('j0000001-0000-0000-0000-000000000001', 'Kafka'),
('j0000001-0000-0000-0000-000000000001', 'PostgreSQL'),
('j0000001-0000-0000-0000-000000000001', 'Go'),
('j0000001-0000-0000-0000-000000000001', 'Kubernetes');

INSERT INTO job_benefits (job_id, benefit) VALUES
('j0000001-0000-0000-0000-000000000001', 'HEALTH_INSURANCE'),
('j0000001-0000-0000-0000-000000000001', 'RETIREMENT_401K'),
('j0000001-0000-0000-0000-000000000001', 'UNLIMITED_PTO'),
('j0000001-0000-0000-0000-000000000001', 'EQUITY'),
('j0000001-0000-0000-0000-000000000001', 'REMOTE_STIPEND');

INSERT INTO job_screening_questions (id, job_id, question_text, question_type, required, order_index)
VALUES
('q0000001-0000-0000-0000-000000000001', 'j0000001-0000-0000-0000-000000000001', 'How many years of production experience do you have with distributed consensus or message brokers (Kafka/Raft)?', 'TEXT', TRUE, 1),
('q0000002-0000-0000-0000-000000000002', 'j0000001-0000-0000-0000-000000000001', 'Are you eligible to work remotely in the UK or European timezones?', 'BOOLEAN', TRUE, 2)
ON CONFLICT (id) DO NOTHING;


-- Job 2: Linear - Senior Full Stack Product Engineer (30 Days Close Timeline)
INSERT INTO jobs (id, company_id, title, slug, description, requirements, location, workplace_type, job_type, experience_level, min_salary, max_salary, currency, salary_period, has_equity, equity_range, has_sign_on_bonus, sign_on_bonus, annual_bonus_percentage, compensation_notes, expires_at, status, applicant_count, views_count, fraud_risk_score, fraud_risk_level, created_at, updated_at)
VALUES (
    'j0000002-0000-0000-0000-000000000002',
    'c0000002-0000-0000-0000-000000000002',
    'Senior Full Stack Product Engineer - Cycles & Sync',
    'senior-full-stack-product-engineer-cycles-sync',
    '<p>Linear builds products that feel magical to use. Craft keyboard-first interfaces, real-time client-side sync engines, and GraphQL microservices that keep product teams in flow.</p>',
    '• 5+ years building modern full-stack web applications with TypeScript, React, and Next.js\n• Passion for craft, design aesthetics, typography, and keyboard shortcuts\n• Experience with state synchronization (WebSockets, CRDTs, or local-first architecture)',
    'London, UK or Remote (EU/UK)',
    'HYBRID',
    'FULL_TIME',
    'SENIOR',
    95000,
    130000,
    'GBP',
    'YEARLY',
    TRUE,
    '0.10% - 0.25% Equity',
    FALSE,
    NULL,
    10,
    'Competitive equity package with 10-year exercise window and top-tier healthcare.',
    NOW() + INTERVAL '30 days',
    'PUBLISHED',
    1,
    412,
    0,
    'LOW',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO job_tags (job_id, tag) VALUES
('j0000002-0000-0000-0000-000000000002', 'Next.js'),
('j0000002-0000-0000-0000-000000000002', 'TypeScript'),
('j0000002-0000-0000-0000-000000000002', 'React'),
('j0000002-0000-0000-0000-000000000002', 'GraphQL'),
('j0000002-0000-0000-0000-000000000002', 'TailwindCSS'),
('j0000002-0000-0000-0000-000000000002', 'PostgreSQL');

INSERT INTO job_benefits (job_id, benefit) VALUES
('j0000002-0000-0000-0000-000000000002', 'HEALTH_INSURANCE'),
('j0000002-0000-0000-0000-000000000002', 'UNLIMITED_PTO'),
('j0000002-0000-0000-0000-000000000002', 'EQUITY'),
('j0000002-0000-0000-0000-000000000002', 'LEARNING_BUDGET'),
('j0000002-0000-0000-0000-000000000002', 'REMOTE_STIPEND');


-- Job 3: Vercel - Principal Cloud Infrastructure Architect (7 Days Close Timeline)
INSERT INTO jobs (id, company_id, title, slug, description, requirements, location, workplace_type, job_type, experience_level, min_salary, max_salary, currency, salary_period, has_equity, equity_range, has_sign_on_bonus, sign_on_bonus, annual_bonus_percentage, compensation_notes, expires_at, status, applicant_count, views_count, fraud_risk_score, fraud_risk_level, created_at, updated_at)
VALUES (
    'j0000003-0000-0000-0000-000000000003',
    'c0000003-0000-0000-0000-000000000003',
    'Principal Cloud Infrastructure Architect - Edge Network',
    'principal-cloud-infrastructure-architect-edge-network',
    '<p>At Vercel, we run the edge infrastructure that powers millions of websites. Lead the global Anycast routing, Kubernetes fleet orchestration, and multi-cloud failover infrastructure.</p>',
    '• 8+ years architecting global cloud infrastructure using Terraform, Kubernetes, and AWS/GCP\n• Expertise in Anycast BGP routing, DDoS mitigation, and edge proxy caches',
    'Remote (Worldwide)',
    'REMOTE',
    'FULL_TIME',
    'LEAD',
    160000,
    210000,
    'GBP',
    'YEARLY',
    TRUE,
    '0.20% - 0.40% Equity',
    TRUE,
    25000,
    20,
    'Includes annual executive bonus, remote wellness stipend, and hardware allowance.',
    NOW() + INTERVAL '7 days',
    'PUBLISHED',
    1,
    520,
    0,
    'LOW',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO job_tags (job_id, tag) VALUES
('j0000003-0000-0000-0000-000000000003', 'Kubernetes'),
('j0000003-0000-0000-0000-000000000003', 'Terraform'),
('j0000003-0000-0000-0000-000000000003', 'AWS'),
('j0000003-0000-0000-0000-000000000003', 'GCP'),
('j0000003-0000-0000-0000-000000000003', 'Docker');

INSERT INTO job_benefits (job_id, benefit) VALUES
('j0000003-0000-0000-0000-000000000003', 'HEALTH_INSURANCE'),
('j0000003-0000-0000-0000-000000000003', 'RETIREMENT_401K'),
('j0000003-0000-0000-0000-000000000003', 'UNLIMITED_PTO'),
('j0000003-0000-0000-0000-000000000003', 'EQUITY');


-- Job 4: Monzo - Lead Mobile Engineer (2 Days Flash Hiring Timeline)
INSERT INTO jobs (id, company_id, title, slug, description, requirements, location, workplace_type, job_type, experience_level, min_salary, max_salary, currency, salary_period, has_equity, equity_range, has_sign_on_bonus, sign_on_bonus, annual_bonus_percentage, compensation_notes, expires_at, status, applicant_count, views_count, fraud_risk_score, fraud_risk_level, created_at, updated_at)
VALUES (
    'j0000004-0000-0000-0000-000000000004',
    'c0000004-0000-0000-0000-000000000004',
    'Lead Mobile Engineer - Core Banking App',
    'lead-mobile-engineer-core-banking-app',
    '<p>Monzo is hiring a <strong>Lead Mobile Engineer</strong> to head the mobile platform team. Lead native iOS and Android architecture, biometric authentication, and real-time balance updates for 9+ million customers.</p>',
    '• 6+ years mobile engineering leadership across iOS (Swift), Android (Kotlin), or React Native\n• Experience with cryptographic key storage and Open Banking APIs',
    'London, United Kingdom',
    'HYBRID',
    'FULL_TIME',
    'LEAD',
    110000,
    145000,
    'GBP',
    'YEARLY',
    TRUE,
    'Share options pool',
    FALSE,
    NULL,
    10,
    'Central London headquarters with hybrid 2-days office schedule.',
    NOW() + INTERVAL '2 days',
    'PUBLISHED',
    1,
    188,
    0,
    'LOW',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO job_tags (job_id, tag) VALUES
('j0000004-0000-0000-0000-000000000004', 'React Native'),
('j0000004-0000-0000-0000-000000000004', 'iOS'),
('j0000004-0000-0000-0000-000000000004', 'Swift'),
('j0000004-0000-0000-0000-000000000004', 'Kotlin'),
('j0000004-0000-0000-0000-000000000004', 'TypeScript');

INSERT INTO job_benefits (job_id, benefit) VALUES
('j0000004-0000-0000-0000-000000000004', 'HEALTH_INSURANCE'),
('j0000004-0000-0000-0000-000000000004', 'RETIREMENT_401K'),
('j0000004-0000-0000-0000-000000000004', 'PARENTAL_LEAVE'),
('j0000004-0000-0000-0000-000000000004', 'COMMUTER_BENEFITS');


-- ----------------------------------------------------------------------------
-- 5. CANDIDATE APPLICATIONS (4 Applications in Different Pipeline Stages)
-- ----------------------------------------------------------------------------

-- Application 1: Alex Chen -> Stripe (Stage: INTERVIEWING)
INSERT INTO applications (id, job_id, candidate_id, resume_url, cover_letter, phone, match_score, xai_explanation, status, created_at, updated_at)
VALUES (
    'app00001-0000-0000-0000-000000000001',
    'j0000001-0000-0000-0000-000000000001',
    'u0000011-0000-0000-0000-000000000011',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'I have spent the last 4 years architecting Datadog metrics ingestion engine handling 15TB daily on Kafka and Java 21. Joining Stripes core ledger team to ensure zero-data-loss accounting aligns directly with my engineering focus.',
    '+44 7700 900123',
    96,
    'Candidate holds 8+ years in Distributed Systems, Java 21, Kafka, and PostgreSQL matching 100% of required core competencies.',
    'INTERVIEWING',
    NOW() - INTERVAL '2 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Application 1 Screening Answers
INSERT INTO application_screening_answers (id, application_id, question_id, question_text, answer_text)
VALUES
('ans00001-0000-0000-0000-000000000001', 'app00001-0000-0000-0000-000000000001', 'q0000001-0000-0000-0000-000000000001', 'How many years of production experience do you have with distributed consensus or message brokers (Kafka/Raft)?', 'Over 6 years working directly with Kafka clusters and customized Raft state machines.'),
('ans00002-0000-0000-0000-000000000002', 'app00001-0000-0000-0000-000000000001', 'q0000002-0000-0000-0000-000000000002', 'Are you eligible to work remotely in the UK or European timezones?', 'Yes')
ON CONFLICT (id) DO NOTHING;

-- Application 1 Interview Scheduled (Google Meet link)
INSERT INTO interviews (id, application_id, candidate_id, employer_id, title, scheduled_at, duration_minutes, meeting_link, notes, status, created_at, updated_at)
VALUES (
    'int00001-0000-0000-0000-000000000001',
    'app00001-0000-0000-0000-000000000001',
    'u0000011-0000-0000-0000-000000000011',
    'u0000001-0000-0000-0000-000000000001',
    'Stripe Core Ledger: System Architecture Deep Dive with Staff Lead',
    NOW() + INTERVAL '3 days',
    60,
    'https://meet.google.com/xyz-core-ledger',
    'Discussion covering event idempotency, geo-partitioning, and disaster failover scenarios.',
    'SCHEDULED',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Application 1 Internal Recruiter Rating Scorecard
INSERT INTO application_screening_notes (id, application_id, author_id, note, rating, created_at)
VALUES (
    'sn000001-0000-0000-0000-000000000001',
    'app00001-0000-0000-0000-000000000001',
    'u0000001-0000-0000-0000-000000000001',
    'Phenomenal technical background. Alex led the Datadog throughput optimization and answered all screening queries flawlessly. Strong recommendation to move forward.',
    5,
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- Application 2: Priya Patel -> Linear (Stage: OFFERED)
INSERT INTO applications (id, job_id, candidate_id, resume_url, cover_letter, phone, match_score, xai_explanation, status, created_at, updated_at)
VALUES (
    'app00002-0000-0000-0000-000000000002',
    'j0000002-0000-0000-0000-000000000002',
    'u0000012-0000-0000-0000-000000000012',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Linear is the benchmark for craftsmanship in modern software. My background in local-first sync and custom WebAssembly SQLite clients allows me to immediately contribute to Linear cycles.',
    '+44 7700 900456',
    94,
    'Priya brings expert-level TypeScript, Next.js, and GraphQL experience. Extensive open-source contributions in reactive UI frameworks.',
    'OFFERED',
    NOW() - INTERVAL '6 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Application 2 Active Job Offer with E-Signature Token
-- Candidates can view and sign at: /offers/sign/linear-offer-sig-token-priya-patel-2026
INSERT INTO job_offers (id, application_id, candidate_id, company_id, created_by_user_id, job_title, base_salary, currency, pay_period, equity_details, sign_on_bonus, annual_bonus_details, benefits_summary, start_date, expires_at, signature_token, status, created_at, updated_at)
VALUES (
    'off00001-0000-0000-0000-000000000001',
    'app00002-0000-0000-0000-000000000002',
    'u0000012-0000-0000-0000-000000000012',
    'c0000002-0000-0000-0000-000000000002',
    'u0000002-0000-0000-0000-000000000002',
    'Senior Full Stack Product Engineer - Cycles & Sync',
    120000,
    'GBP',
    'ANNUAL',
    '0.18% ISO Stock Options with 10-year exercise window and 1-year cliff',
    10000,
    '10% performance bonus target',
    'Comprehensive Bupa Private Healthcare, Unlimited PTO, £3,500 Home Office Stipend, and £2,000 Annual Learning Budget.',
    CURRENT_DATE + 30,
    NOW() + INTERVAL '7 days',
    'linear-offer-sig-token-priya-patel-2026',
    'SENT',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- Application 3: Marcus Vance -> Vercel (Stage: SHORTLISTED)
INSERT INTO applications (id, job_id, candidate_id, resume_url, cover_letter, phone, match_score, xai_explanation, status, created_at, updated_at)
VALUES (
    'app00003-0000-0000-0000-000000000003',
    'j0000003-0000-0000-0000-000000000003',
    'u0000013-0000-0000-0000-000000000013',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Architected multi-region Anycast edge infrastructure and Kubernetes fleet controllers.',
    '+1 415 555 0192',
    92,
    'High compatibility with Vercel edge infrastructure and Terraform leadership.',
    'SHORTLISTED',
    NOW() - INTERVAL '1 day',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- Application 4: Elena Rostova -> Monzo (Stage: REVIEWING)
INSERT INTO applications (id, job_id, candidate_id, resume_url, cover_letter, phone, match_score, xai_explanation, status, created_at, updated_at)
VALUES (
    'app00004-0000-0000-0000-000000000004',
    'j0000004-0000-0000-0000-000000000004',
    'u0000014-0000-0000-0000-000000000014',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Excited to bring high-performance native mobile architectures to Monzo 9M+ active users.',
    '+44 7700 900888',
    88,
    'Strong mobile engineering background across iOS, Android, and React Native banking security.',
    'REVIEWING',
    NOW() - INTERVAL '4 hours',
    NOW()
) ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ============================================================================
-- ACCOUNTS & VERIFICATION DIRECTORY
-- ============================================================================
-- All Passwords: "Password123!"
--
-- Candidates:
--   1. alex.chen@gmail.com       (Staff Distributed Systems Engineer)
--   2. priya.patel@gmail.com     (Senior Full Stack Product Engineer)
--   3. marcus.vance@gmail.com    (Principal Cloud Infrastructure Architect)
--   4. elena.rostova@gmail.com   (Lead Mobile Engineer)
--
-- Employers:
--   1. sarah.jenkins@stripe.com  (Stripe Employer Admin)
--   2. tuomas@linear.app         (Linear Employer Admin)
--   3. rauchg@vercel.com         (Vercel Employer Admin)
--   4. claire.wilson@monzo.com   (Monzo Bank Employer Admin)
--
-- Active Extended Offer E-Signature URL:
--   http://localhost:3000/offers/sign/linear-offer-sig-token-priya-patel-2026
-- ============================================================================

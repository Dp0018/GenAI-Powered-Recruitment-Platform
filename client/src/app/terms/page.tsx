import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/shared/footer";

export const metadata = {
  title: "Terms of Service - JobPortal",
  description: "Terms and conditions governing the use of the JobPortal multi-vendor hiring platform.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-primary/10 border border-primary/20 text-primary">
            <Shield className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Effective Date: January 1, 2026. Last updated: October 2026.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 text-sm text-foreground/80 leading-relaxed bg-card/70 border border-border rounded-lg p-6 sm:p-10">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white tracking-tight">
            1. Platform Overview and Acceptance of Terms
          </h2>
          <p>
            JobPortal provides a multi-vendor talent marketplace connecting prospective candidates with verified employer organizations. By creating an account, browsing job listings, or submitting applications through this website, you agree to comply with and be bound by these Terms of Service and all incorporated policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white tracking-tight">
            2. User Roles and Account Governance
          </h2>
          <p>
            Access to specific features within JobPortal is controlled by Role-Based Access Control (RBAC). You are responsible for safeguarding your login credentials and one-time password (OTP) verification tokens.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>
              <strong className="text-zinc-200">Candidate Accounts:</strong> Granted to individuals seeking employment. Candidates must provide accurate contact and career history details.
            </li>
            <li>
              <strong className="text-zinc-200">Employer Administrator Accounts:</strong> Granted to designated company representatives authorized to bind the enterprise and invite recruiters.
            </li>
            <li>
              <strong className="text-zinc-200">Recruiter Accounts:</strong> Granted to team members assigned by an Employer Admin to review candidate submissions.
            </li>
            <li>
              <strong className="text-zinc-200">Platform Administrators:</strong> Responsible for verifying company entities and monitoring platform security.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white tracking-tight">
            3. Employer Verification and Job Listing Standards
          </h2>
          <p>
            To prevent fraud and misleading representations, all newly registered employer organizations enter a mandatory Pending Verification status. Employers may create listing drafts, but public broadcasting of job requisitions requires authorization from Platform Administrators.
          </p>
          <p>
            Job postings must represent bona fide employment opportunities. Postings requiring upfront financial payments from applicants, multi-level marketing schemes, or misleading compensation structures are strictly prohibited and result in immediate termination of the employer account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white tracking-tight">
            4. Candidate Data and Privacy
          </h2>
          <p>
            Candidate profiles, resumes, and communications submitted through JobPortal are shared exclusively with the employers to whom the candidate expressly applies. Employers agree to treat candidate data in accordance with applicable privacy legislation and not to resell or distribute candidate information outside their direct hiring processes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white tracking-tight">
            5. Acceptable Use and Security
          </h2>
          <p>
            Users may not attempt to circumvent authentication layers, exploit API vulnerabilities, initiate automated scraping or crawling without written authorization, or transmit malicious code through the platform. Any security concerns should be reported immediately to platform administrators.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white tracking-tight">
            6. Limitation of Liability and Disclaimers
          </h2>
          <p>
            JobPortal serves as an intermediary platform. We do not guarantee employment offers for candidates, nor do we guarantee candidate suitability for employers. All hiring decisions, interviews, and employment agreements remain exclusively between the candidate and the prospective employer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white tracking-tight">
            7. Contact Information
          </h2>
          <p>
            Inquiries regarding these Terms of Service or regulatory compliance should be directed to the platform governance team via administrative inquiries.
          </p>
        </section>
      </div>
      <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
        <Footer />
      </div>
    </div>
  );
}

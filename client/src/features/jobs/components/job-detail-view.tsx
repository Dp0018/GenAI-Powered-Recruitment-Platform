"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useJobDetailQuery } from "../hooks/use-jobs";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useApplicationStatusQuery } from "@/features/applications/hooks/use-applications";
import { ApplyJobModal } from "@/features/applications/components/apply-job-modal";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Loader2,
  Send,
  AlertCircle,
} from "lucide-react";

interface JobDetailViewProps {
  slug: string;
}

export function JobDetailView({ slug }: JobDetailViewProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading, isError } = useJobDetailQuery(slug);
  const { data: hasApplied = false } = useApplicationStatusQuery(
    job?.id || "",
    Boolean(isAuthenticated && job?.id)
  );

  const [copied, setCopied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/jobs/${slug}`);
      return;
    }
    setApplyModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Loading requisition specifications...
        </p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 text-center space-y-4">
        <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="size-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Requisition Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The requested job position may have been closed, archived, or the URL slug is invalid.
        </p>
        <div className="pt-2">
          <Link href="/jobs">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              <span>Back to Job Board</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = job.company?.verificationStatus === "VERIFIED";

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Openings</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded border border-border bg-card"
        >
          <Share2 className="size-3.5" />
          <span>{copied ? "Link Copied!" : "Share Requisition"}</span>
        </button>
      </div>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3">
            {/* Company metadata */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-semibold text-primary font-mono flex items-center gap-1.5">
                <Building2 className="size-4 text-primary" />
                <span>{job.company?.name || "Corporate Employer"}</span>
              </span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                  <CheckCircle2 className="size-3.5" />
                  <span>Verified Corporate Entity</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {job.title}
            </h1>

            {/* Key Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-foreground">
                <MapPin className="size-3 text-primary" />
                <span>{job.location}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-foreground">
                <Briefcase className="size-3 text-primary" />
                <span>{job.workplaceType}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-foreground">
                <span>{job.jobType.replace("_", " ")}</span>
              </span>
              {job.applicantCount !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-muted-foreground">
                  <Users className="size-3" />
                  <span>{job.applicantCount} applicants</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Action: Compensation & Apply */}
          <div className="sm:text-right shrink-0 flex flex-col justify-between sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
            <div>
              {job.minSalary && job.maxSalary ? (
                <div className="font-mono text-lg font-bold text-foreground">
                  ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k{" "}
                  <span className="text-xs text-muted-foreground">{job.currency} / yr</span>
                </div>
              ) : job.minSalary ? (
                <div className="font-mono text-lg font-bold text-foreground">
                  From ${(job.minSalary / 1000).toFixed(0)}k{" "}
                  <span className="text-xs text-muted-foreground">{job.currency} / yr</span>
                </div>
              ) : (
                <span className="text-xs font-mono text-muted-foreground">
                  Competitive Compensation Band
                </span>
              )}
            </div>

            {hasApplied ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs font-medium font-mono">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <Button
                onClick={handleApplyClick}
                className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm shadow-primary/20 gap-2"
              >
                <Send className="size-3.5" />
                <span>{isAuthenticated ? "Submit Candidacy" : "Sign In to Apply"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">Domain Competencies:</span>
            {job.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded bg-secondary/80 border border-border text-xs font-mono text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Description & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Description & Qualifications */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview */}
          <section className="p-6 rounded-xl bg-card/60 border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground tracking-tight border-b border-border pb-3">
              Role Specification
            </h2>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
              {job.description}
            </div>
          </section>

          {/* Requirements */}
          {job.requirements && (
            <section className="p-6 rounded-xl bg-card/60 border border-border space-y-4">
              <h2 className="text-lg font-bold text-foreground tracking-tight border-b border-border pb-3">
                Key Qualifications & Expectations
              </h2>
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
                {job.requirements}
              </div>
            </section>
          )}

          {/* Direct Apply CTA footer */}
          <section className="p-6 rounded-xl bg-secondary/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Interested in this position?</h3>
              <p className="text-xs text-muted-foreground">
                Direct candidate profile dispatch directly to {job.company?.name || "the hiring team"}.
              </p>
            </div>
            {!hasApplied && (
              <Button
                onClick={handleApplyClick}
                className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm shadow-primary/20 shrink-0"
              >
                <span>{isAuthenticated ? "Submit Candidacy" : "Sign In to Apply"}</span>
              </Button>
            )}
          </section>
        </div>

        {/* Right Column: Company & Requisition Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* About Company */}
          <div className="p-5 rounded-xl bg-card/60 border border-border space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
              <Building2 className="size-3.5 text-primary" />
              <span>Hiring Organization</span>
            </h3>

            <div className="space-y-2">
              <div className="font-bold text-base text-foreground">{job.company?.name}</div>
              {job.company?.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {job.company.description}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-border space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Entity Status</span>
                <span className="text-foreground font-medium">
                  {job.company?.verificationStatus || "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Requisition ID</span>
                <span className="text-muted-foreground truncate max-w-[140px]">{job.id}</span>
              </div>
            </div>
          </div>

          {/* Security & Authenticity Guarantee */}
          <div className="p-5 rounded-xl bg-card/60 border border-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary font-mono">
              <ShieldCheck className="size-4" />
              <span>Direct Hiring Guarantee</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This position is posted directly by an authenticated corporate representative. No intermediaries, headhunters, or automated scrapers.
            </p>
          </div>
        </div>
      </div>

      <ApplyJobModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company?.name || "Corporate Employer"}
      />
    </div>
  );
}

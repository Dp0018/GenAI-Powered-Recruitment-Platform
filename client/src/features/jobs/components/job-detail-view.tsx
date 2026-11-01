"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobDetailQuery } from "../hooks/use-jobs";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useApplicationStatusQuery } from "@/features/applications/hooks/use-applications";
import { ApplyJobModal } from "@/features/applications/components/apply-job-modal";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "./bookmark-button";
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
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Clock,
  Send,
  Zap,
  Eye,
  Gift,
  Coins,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import { useProfileQuery } from "@/features/profile/hooks/use-profile";
import { useSubmitApplicationMutation } from "@/features/applications/hooks/use-applications";
import { COMPANY_BENEFITS, getBenefitLabel } from "../types/benefits";
import { SkillsMatchBreakdownCard } from "./skills-match-breakdown-card";
import { JobFraudShieldBadge } from "@/features/ai/components/job-fraud-shield-badge";
import { ExplainableMatchCard } from "@/features/ai/components/explainable-match-card";
import { useExplainJobMatchQuery } from "@/features/ai/hooks/use-ai";

interface JobDetailViewProps {
  slug: string;
}

export function JobDetailView({ slug }: JobDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading, isError } = useJobDetailQuery(slug);
  const { data: hasApplied = false } = useApplicationStatusQuery(
    job?.id || "",
    Boolean(isAuthenticated && job?.id)
  );

  const [copied, setCopied] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [referralCode, setReferralCode] = useState<string | undefined>(undefined);
  const [showAiFit, setShowAiFit] = useState(false);

  const {
    data: aiMatchData,
    isLoading: isAiMatchLoading,
    refetch: refetchAiFit,
  } = useExplainJobMatchQuery(
    job?.id,
    Boolean(showAiFit && isAuthenticated && job?.id)
  );

  const referralFromUrl = searchParams.get("ref");

  useEffect(() => {
    if (referralFromUrl) {
      setReferralCode(referralFromUrl);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("job_portal_referral", referralFromUrl);
      }
    } else if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("job_portal_referral");
      if (saved) setReferralCode(saved);
    }
  }, [referralFromUrl]);

  const isCandidate = isAuthenticated && (!user?.role || user.role === "CANDIDATE");
  const { data: profile } = useProfileQuery(Boolean(isCandidate));
  const submitMutation = useSubmitApplicationMutation(job?.id || "");

  const hasRequiredQuestions = Boolean(
    job?.screeningQuestions && job.screeningQuestions.some((q) => q.required)
  );
  const canQuickApply = Boolean(
    isCandidate &&
      profile?.resumeUrl &&
      !hasRequiredQuestions &&
      !job?.expired &&
      !hasApplied
  );

  const handleQuickApply = () => {
    if (!profile?.resumeUrl || !job?.id) return;
    submitMutation.mutate({
      resumeUrl: profile.resumeUrl,
      phone: profile.phone || "",
      referralCode: referralCode || undefined,
      referredBy: referralCode ? `Referral (${referralCode})` : undefined,
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyReferral = () => {
    if (typeof window !== "undefined") {
      const myRef = user
        ? `emp_${(user.name?.toLowerCase().replace(/\s+/g, "_") || user.id.slice(0, 8))}`
        : "advocate_link";
      const referralUrl = `${window.location.origin}/jobs/${slug}?ref=${myRef}`;
      navigator.clipboard.writeText(referralUrl);
      setCopiedReferral(true);
      toast.success(`Referral link copied (${myRef})! Anyone applying with this link will be tracked.`);
      setTimeout(() => setCopiedReferral(false), 2500);
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
      {/* Top Navigation & Referral Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Openings</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReferral}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 cursor-pointer"
            title="Generate and copy unique referral tracking link to attribute incoming hires"
          >
            <Gift className="size-3.5" />
            <span>{copiedReferral ? "Referral Link Copied!" : "Referral Link"}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded border border-border bg-card cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>{copied ? "Link Copied!" : "Share Requisition"}</span>
          </button>
        </div>
      </div>

      {/* Referral Tracking Banner */}
      {referralCode && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Referral Program Active:</strong> You are viewing this opening via referral link (<code>{referralCode}</code>).
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase bg-emerald-500/20 px-2 py-0.5 rounded font-semibold shrink-0">
            Source Tracked
          </span>
        </div>
      )}

      {/* Expiration Alert Banner */}
      {job.expired && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 text-xs">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            <strong>Requisition Expired:</strong> This position reached its posting duration deadline and is no longer accepting candidate submissions.
          </span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3">
            {/* Company metadata */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {job.company?.slug ? (
                <Link
                  href={`/companies/${job.company.slug}`}
                  className="text-sm font-semibold text-primary hover:underline font-mono flex items-center gap-1.5"
                >
                  <Building2 className="size-4 text-primary" />
                  <span>{job.company?.name || "Corporate Employer"}</span>
                </Link>
              ) : (
                <span className="text-sm font-semibold text-primary font-mono flex items-center gap-1.5">
                  <Building2 className="size-4 text-primary" />
                  <span>{job.company?.name || "Corporate Employer"}</span>
                </span>
              )}
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
              <JobFraudShieldBadge
                fraudScore={job.fraudRiskScore}
                riskLevel={job.fraudRiskLevel}
                fraudReasons={job.fraudReasons}
                isQuarantined={job.isQuarantined}
              />
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
              {job.experienceLevel && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-foreground">
                  <span>{job.experienceLevel.replace("_", " ")}</span>
                </span>
              )}
              {job.expired ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-destructive/10 border border-destructive/20 text-destructive">
                  <AlertTriangle className="size-3" />
                  <span>Expired</span>
                </span>
              ) : job.expiresAt ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-muted-foreground">
                  <Clock className="size-3" />
                  <span>
                    Expires{" "}
                    {new Date(job.expiresAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>
              ) : null}
              {job.applicantCount !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-muted-foreground">
                  <Users className="size-3" />
                  <span>{job.applicantCount} applicants</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border text-muted-foreground">
                <Eye className="size-3" />
                <span>{job.viewsCount || 0} views</span>
              </span>
            </div>
          </div>

          {/* Right Action: Compensation & Apply */}
          <div className="sm:text-right shrink-0 flex flex-col justify-between sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
            <div>
              {job.minSalary && job.maxSalary ? (
                <div className="font-mono text-lg font-bold text-foreground">
                  ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k{" "}
                  <span className="text-xs text-muted-foreground">
                    {job.currency} {job.salaryPeriod === "HOURLY" ? "/ hr" : job.salaryPeriod === "MONTHLY" ? "/ mo" : "/ yr"}
                  </span>
                </div>
              ) : job.minSalary ? (
                <div className="font-mono text-lg font-bold text-foreground">
                  From ${(job.minSalary / 1000).toFixed(0)}k{" "}
                  <span className="text-xs text-muted-foreground">
                    {job.currency} {job.salaryPeriod === "HOURLY" ? "/ hr" : job.salaryPeriod === "MONTHLY" ? "/ mo" : "/ yr"}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-muted-foreground">
                  Competitive Compensation Band
                </span>
              )}
              {(job.hasEquity || job.hasSignOnBonus) && (
                <div className="flex items-center sm:justify-end gap-1.5 pt-1">
                  {job.hasEquity && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                      + Equity
                    </span>
                  )}
                  {job.hasSignOnBonus && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium text-indigo-400 bg-indigo-950/40 border border-indigo-800/40">
                      + Bonus
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <BookmarkButton
                jobId={job.id}
                size="default"
                variant="outline"
                showText
                className="h-10 border-border"
              />
              {job.expired ? (
                <Button
                  disabled
                  variant="outline"
                  className="h-10 px-5 border-border text-muted-foreground text-xs font-mono cursor-not-allowed opacity-60 gap-1.5"
                >
                  <AlertTriangle className="size-3.5" />
                  <span>Requisition Expired</span>
                </Button>
              ) : hasApplied ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs font-medium font-mono">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>Application Submitted</span>
                </div>
              ) : canQuickApply ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleQuickApply}
                    disabled={submitMutation.isPending}
                    className="h-10 px-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-xs rounded-md shadow-md gap-1.5 transition-all"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Zap className="size-3.5 fill-current" />
                    )}
                    <span>1-Click Quick Apply</span>
                  </Button>
                  <Button
                    onClick={handleApplyClick}
                    variant="outline"
                    className="h-10 px-3 text-xs font-medium border-border"
                    title="Apply with custom resume or cover letter"
                  >
                    Custom
                  </Button>
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
          {/* Candidate Skills Match Breakdown */}
          <SkillsMatchBreakdownCard jobId={job.id} />

          {/* Explainable AI (XAI) Fit Engine */}
          {isAuthenticated && user?.role === "CANDIDATE" && (
            <section className="p-6 rounded-xl bg-card/60 border border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <span>Explainable AI (XAI) Fit Engine</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono">
                      Transparent multi-factor match synthesis powered by Gemini 3.5 Flash
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={showAiFit ? "outline" : "default"}
                  onClick={() => {
                    setShowAiFit(true);
                    if (showAiFit) refetchAiFit();
                  }}
                  disabled={isAiMatchLoading}
                  className="h-8 text-xs font-mono gap-1.5 shrink-0"
                >
                  {isAiMatchLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" />
                      <span>{showAiFit ? "Re-Analyze Match" : "Explain My Fit (AI)"}</span>
                    </>
                  )}
                </Button>
              </div>

              {showAiFit && (
                <div className="pt-1">
                  {isAiMatchLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span className="text-xs font-mono">Auditing competencies, experience, domain, and DE&I fairness...</span>
                    </div>
                  ) : aiMatchData ? (
                    <ExplainableMatchCard data={aiMatchData} />
                  ) : null}
                </div>
              )}
            </section>
          )}

          {/* Overview */}
          <section className="p-6 rounded-xl bg-card/60 border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground tracking-tight border-b border-border pb-3">
              Role Specification
            </h2>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
              {job.description}
            </div>
          </section>

          {/* Compensation & Pay Transparency Breakdown */}
          <section className="p-6 rounded-xl bg-card/60 border border-border space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
              <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                <Coins className="size-5 text-primary" />
                <span>Compensation & Total Rewards Transparency</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                <Scale className="size-3 text-emerald-400" />
                <span>Pay Transparency Compliance</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Base Salary Band */}
              <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-1">
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  Base Salary Band
                </div>
                <div className="text-base font-bold text-foreground font-mono">
                  {job.minSalary && job.maxSalary
                    ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                    : job.minSalary
                    ? `From $${job.minSalary.toLocaleString()}`
                    : "Competitive Base"}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {job.currency} {job.salaryPeriod === "HOURLY" ? "per hour" : job.salaryPeriod === "MONTHLY" ? "per month" : "per year"}
                </div>
              </div>

              {/* Equity / Stock Options */}
              <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-1">
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  Equity Incentive
                </div>
                <div className="text-base font-bold text-foreground font-mono">
                  {job.hasEquity ? (job.equityRange || "Equity Included") : "Not Applicable"}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {job.hasEquity ? "RSUs / ISO stock options" : "Base cash compensation"}
                </div>
              </div>

              {/* Bonus / Variable Comp */}
              <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-1">
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  Variable & Sign-On
                </div>
                <div className="text-base font-bold text-foreground font-mono">
                  {job.hasSignOnBonus && job.signOnBonus
                    ? `$${job.signOnBonus.toLocaleString()} Sign-On`
                    : job.annualBonusPercentage
                    ? `${job.annualBonusPercentage}% Target Bonus`
                    : "Discretionary"}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {job.annualBonusPercentage && job.hasSignOnBonus
                    ? `+ ${job.annualBonusPercentage}% annual target`
                    : "Performance based incentives"}
                </div>
              </div>
            </div>

            {/* Compliance & Geographic Disclosure Banner */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Scale className="size-3.5 text-primary" />
                <span>Statutory Pay Transparency Disclosure</span>
              </div>
              <p className="leading-relaxed">
                {job.compensationNotes ||
                  "In compliance with California SB 1162, New York City Local Law 32, Colorado EPEW, and the EU Pay Transparency Directive, our disclosed compensation range reflects expected base salary for this requisition. Individual compensation offers depend on domain expertise, seniority, candidate geographic location, and demonstrable market experience."}
              </p>
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

          {/* Perks & Benefits Badges */}
          {((job.benefits && job.benefits.length > 0) || (job.company?.benefits && job.company.benefits.length > 0)) && (
            <section className="p-6 rounded-xl bg-card/60 border border-border space-y-4">
              <h2 className="text-lg font-bold text-foreground tracking-tight border-b border-border pb-3 flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>Perks & Corporate Benefits</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {(job.benefits && job.benefits.length > 0 ? job.benefits : job.company?.benefits || []).map((bKey) => {
                  const meta = COMPANY_BENEFITS.find((b) => b.key === bKey);
                  return (
                    <div
                      key={bKey}
                      className="p-3.5 rounded-lg bg-secondary/40 border border-border space-y-1"
                    >
                      <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span className="text-primary font-mono">•</span>
                        <span>{meta ? meta.label : bKey.replace(/_/g, " ")}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {meta?.description || "Corporate benefit package provided to verified hires."}
                      </p>
                    </div>
                  );
                })}
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
        screeningQuestions={job.screeningQuestions}
        referralCode={referralCode}
      />
    </div>
  );
}

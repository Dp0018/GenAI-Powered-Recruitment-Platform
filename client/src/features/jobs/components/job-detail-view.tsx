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
  MapPin,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Share2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Send,
  Zap,
  Gift,
  Coins,
  Award,
  Globe,
  FileText,
  Check,
  ExternalLink,
  Building2,
  TrendingUp,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useProfileQuery } from "@/features/profile/hooks/use-profile";
import { useSubmitApplicationMutation } from "@/features/applications/hooks/use-applications";
import { COMPANY_BENEFITS } from "../types/benefits";
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
  const [showAiFit, setShowAiFit] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "compensation" | "company">("overview");

  const {
    data: aiMatchData,
    isLoading: isAiMatchLoading,
    refetch: refetchAiFit,
  } = useExplainJobMatchQuery(
    job?.id,
    Boolean(showAiFit && isAuthenticated && job?.id)
  );

  const referralFromUrl = searchParams.get("ref");
  const [referralCode] = useState<string | undefined>(() => {
    if (referralFromUrl) return referralFromUrl;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("job_portal_referral") || undefined;
    }
    return undefined;
  });

  useEffect(() => {
    if (referralFromUrl && typeof window !== "undefined") {
      sessionStorage.setItem("job_portal_referral", referralFromUrl);
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
      toast.success("Job URL copied to clipboard");
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
      toast.success(`Referral tracking link copied (${myRef})`);
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

  const scrollToSection = (sectionId: "overview" | "requirements" | "compensation" | "company") => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="size-10 animate-spin text-sky-400" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading opening specifications...
        </p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="w-full max-w-xl mx-auto py-24 px-4 text-center space-y-5">
        <div className="size-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto border border-destructive/20 shadow-inner">
          <AlertCircle className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Job Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            This job opening may have been archived, fulfilled, or the direct link has expired.
          </p>
        </div>
        <div>
          <Link href="/jobs">
            <Button variant="outline" className="gap-2 rounded-xl">
              <ArrowLeft className="size-4" />
              <span>Explore Live Openings</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = job.company?.verificationStatus === "VERIFIED";
  const currencyCode = job.currency && job.currency !== "USD" ? job.currency : "GBP";
  const currencySymbol = currencyCode === "GBP" ? "£" : currencyCode === "EUR" ? "€" : "$";
  const salaryPeriodLabel =
    job.salaryPeriod === "HOURLY"
      ? "per hour"
      : job.salaryPeriod === "MONTHLY"
      ? "per month"
      : "per year";

  const companyInitial = job.company?.name ? job.company.name.charAt(0).toUpperCase() : "C";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Breadcrumb Navigation & Quick Share Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
          <Link
            href="/jobs"
            className="group hover:text-foreground transition-colors flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>All Openings</span>
          </Link>
          <span className="text-border">/</span>
          {job.company?.slug ? (
            <Link
              href={`/companies/${job.company.slug}`}
              className="hover:text-foreground transition-colors font-medium"
            >
              {job.company.name}
            </Link>
          ) : (
            <span className="font-medium">{job.company?.name || "Company"}</span>
          )}
          <span className="text-border">/</span>
          <span className="text-foreground font-semibold truncate max-w-[260px] sm:max-w-none">
            {job.title}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 text-xs font-medium border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors rounded-lg"
          >
            <Share2 className="size-3.5" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyReferral}
            className="h-8 gap-1.5 text-xs font-medium border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors rounded-lg"
            title="Generate and copy your referral link"
          >
            <Gift className="size-3.5" />
            <span>{copiedReferral ? "Referral Copied!" : "Referral Link"}</span>
          </Button>

          <BookmarkButton
            jobId={job.id}
            size="sm"
            variant="outline"
            className="h-8 w-8 rounded-lg border-border/70"
          />
        </div>
      </div>

      {/* Referral Tracking Active Banner */}
      {referralCode && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Referral Program Active:</strong> Applying via advocate tracking link (
              <span className="font-mono font-semibold text-emerald-200">{referralCode}</span>
              ). Your application is flagged for accelerated hiring review.
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
            Source Tracked
          </span>
        </div>
      )}

      {/* Expiration Notice Banner */}
      {job.expired && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive flex items-center gap-3 text-xs">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            <strong>Position Archived:</strong> This job opening has concluded its active interview cycle and is no longer accepting submissions.
          </span>
        </div>
      )}

      {/* Immersive Wide Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-card via-card/90 to-card/60 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-sky-500/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-20 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8 relative z-10">
          {/* Main Info */}
          <div className="space-y-5 max-w-4xl">
            {/* Company Branding & Verified Pills */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="size-16 rounded-2xl bg-linear-to-br from-sky-500/15 via-card to-indigo-500/15 border border-sky-500/25 text-sky-400 font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-inner">
                {companyInitial}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {job.company?.slug ? (
                    <Link
                      href={`/companies/${job.company.slug}`}
                      className="text-lg font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                    >
                      <span>{job.company?.name || "Company"}</span>
                    </Link>
                  ) : (
                    <span className="text-lg font-bold text-sky-400">
                      {job.company?.name || "Company"}
                    </span>
                  )}

                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                      <CheckCircle2 className="size-3 text-emerald-400" />
                      <span>Verified Employer</span>
                    </span>
                  )}

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/25 uppercase tracking-wide">
                    {job.workplaceType}
                  </span>
                </div>

                {job.company?.industry && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="size-3 text-muted-foreground" />
                    <span>{job.company.industry}</span>
                    {job.company?.location && (
                      <>
                        <span className="text-border">•</span>
                        <span>HQ in {job.company.location}</span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Role Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              {job.title}
            </h1>

            {/* Natural Metadata Badges Row */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <MapPin className="size-4 text-sky-400 shrink-0" />
                <span>{job.location}</span>
              </div>
              <span className="text-border hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Briefcase className="size-4 text-muted-foreground shrink-0" />
                <span>{job.jobType.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</span>
              </div>
              {job.experienceLevel && (
                <>
                  <span className="text-border hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <Award className="size-4 text-muted-foreground shrink-0" />
                    <span>{job.experienceLevel.replace("_", " ")}</span>
                  </div>
                </>
              )}
              {job.applicantCount !== undefined && (
                <>
                  <span className="text-border hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="size-4 text-muted-foreground shrink-0" />
                    <span>{job.applicantCount} candidates applied</span>
                  </div>
                </>
              )}
              <div className="sm:ml-auto">
                <JobFraudShieldBadge
                  fraudScore={job.fraudRiskScore}
                  riskLevel={job.fraudRiskLevel}
                  fraudReasons={job.fraudReasons}
                  isQuarantined={job.isQuarantined}
                />
              </div>
            </div>
          </div>

          {/* Right Action Hero Block: Compensation Highlight & Primary CTA */}
          <div className="xl:text-right shrink-0 flex flex-col justify-between xl:items-end gap-5 pt-6 xl:pt-0 border-t xl:border-t-0 border-border/70 min-w-[300px]">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Target Compensation
              </div>
              {job.minSalary && job.maxSalary ? (
                <div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    {currencySymbol}{(job.minSalary / 1000).toFixed(0)}k – {currencySymbol}{(job.maxSalary / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">
                    {currencyCode} {salaryPeriodLabel} (Disclosed Band)
                  </div>
                </div>
              ) : job.minSalary ? (
                <div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    From {currencySymbol}{(job.minSalary / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">
                    {currencyCode} {salaryPeriodLabel}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-foreground">
                  Competitive Compensation
                </div>
              )}

              {(job.hasEquity || job.hasSignOnBonus) && (
                <div className="flex items-center xl:justify-end gap-2 pt-2">
                  {job.hasEquity && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                      + Equity Options
                    </span>
                  )}
                  {job.hasSignOnBonus && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25">
                      + Target Bonus
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 w-full xl:w-auto">
              {job.expired ? (
                <Button
                  disabled
                  variant="outline"
                  className="h-12 px-6 border-border text-muted-foreground text-sm cursor-not-allowed opacity-60 rounded-xl gap-2 w-full sm:w-auto"
                >
                  <AlertTriangle className="size-4" />
                  <span>Position Closed</span>
                </Button>
              ) : hasApplied ? (
                <div className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold w-full sm:w-auto">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>Application Submitted</span>
                </div>
              ) : canQuickApply ? (
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    onClick={handleQuickApply}
                    disabled={submitMutation.isPending}
                    className="h-12 px-7 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 gap-2 transition-all cursor-pointer flex-1 sm:flex-initial"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Zap className="size-4 fill-current" />
                    )}
                    <span>1-Click Apply</span>
                  </Button>
                  <Button
                    onClick={handleApplyClick}
                    variant="outline"
                    className="h-12 px-5 text-sm font-medium border-border/80 rounded-xl hover:bg-secondary/60"
                    title="Customize application note and details"
                  >
                    Custom
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleApplyClick}
                  className="h-12 px-8 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 gap-2.5 transition-all cursor-pointer w-full sm:w-auto"
                >
                  <Send className="size-4" />
                  <span>{isAuthenticated ? "Apply for this Role" : "Sign In to Apply"}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Highlighted Key Skills Bar */}
        {job.tags && job.tags.length > 0 && (
          <div className="pt-6 border-t border-border/60 flex flex-wrap items-center gap-2.5">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mr-1">
              Core Stack:
            </span>
            {job.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1 rounded-full text-xs font-semibold bg-secondary/80 border border-border/70 text-foreground hover:border-sky-500/40 hover:text-sky-400 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Anchor Navigation Subnav Bar */}
      <div className="sticky top-2 z-20 bg-background/95 backdrop-blur-md py-2.5 border-y border-border/60">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => scrollToSection("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-secondary text-foreground border border-border/80 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Role Overview
          </button>
          {job.requirements && (
            <button
              onClick={() => scrollToSection("requirements")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "requirements"
                  ? "bg-secondary text-foreground border border-border/80 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Requirements & Skills
            </button>
          )}
          <button
            onClick={() => scrollToSection("compensation")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "compensation"
                ? "bg-secondary text-foreground border border-border/80 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Compensation & Equity
          </button>
          <button
            onClick={() => scrollToSection("company")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "company"
                ? "bg-secondary text-foreground border border-border/80 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            About {job.company?.name || "Company"}
          </button>
        </div>
      </div>

      {/* Main Grid: Comprehensive Left Content & Sticky Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: In-Depth Editorial Role Breakdown */}
        <div className="lg:col-span-8 space-y-8">
          {/* Candidate AI Fit Card */}
          <SkillsMatchBreakdownCard jobId={job.id} />

          {/* AI Explainable Fit Evaluation Engine */}
          {isAuthenticated && user?.role === "CANDIDATE" && (
            <section className="p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      AI Profile Qualification Match
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Compare your profile skills and experience against this role
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
                  className="h-9 px-4 text-xs font-semibold gap-2 rounded-xl shrink-0 cursor-pointer"
                >
                  {isAiMatchLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Analyzing Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" />
                      <span>{showAiFit ? "Refresh Fit Score" : "Check Profile Match"}</span>
                    </>
                  )}
                </Button>
              </div>

              {showAiFit && (
                <div className="pt-2">
                  {isAiMatchLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <Loader2 className="size-6 animate-spin text-sky-400" />
                      <span className="text-xs font-medium">Running match diagnostics on your candidate profile...</span>
                    </div>
                  ) : aiMatchData ? (
                    <ExplainableMatchCard data={aiMatchData} />
                  ) : null}
                </div>
              )}
            </section>
          )}

          {/* Role Overview & Mission */}
          <section
            id="overview"
            className="p-6 sm:p-10 rounded-3xl bg-card/60 border border-border/80 space-y-6 shadow-xs scroll-mt-20"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <FileText className="size-6 text-sky-400" />
                  <span>About the Position</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Role scope, mission objectives, and architectural responsibilities
                </p>
              </div>
            </div>

            {/* Role Highlights Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/60 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  Department
                </span>
                <div className="font-bold text-foreground">
                  {job.company?.industry || "Core Platform Engineering"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  Work Arrangement
                </span>
                <div className="font-bold text-foreground">
                  {job.workplaceType} • {job.location}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  Seniority Level
                </span>
                <div className="font-bold text-foreground">
                  {job.experienceLevel ? job.experienceLevel.replace("_", " ") : "Experienced"}
                </div>
              </div>
            </div>

            {/* Description Body */}
            {job.description && job.description.includes("<") && job.description.includes(">") ? (
              <div
                className="text-sm sm:text-base text-foreground/90 leading-relaxed font-sans prose prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2.5 [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground [&_p]:my-3 [&_li]:my-1"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <div className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
                {job.description}
              </div>
            )}
          </section>

          {/* Requirements & Qualifications */}
          {job.requirements && (
            <section
              id="requirements"
              className="p-6 sm:p-10 rounded-3xl bg-card/60 border border-border/80 space-y-6 shadow-xs scroll-mt-20"
            >
              <div className="pb-4 border-b border-border/60 space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <Check className="size-6 text-sky-400" />
                  <span>Qualifications & Requirements</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Technical requirements, domain experience, and baseline competencies
                </p>
              </div>

              <div className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
                {job.requirements}
              </div>

              {/* Skills Cloud */}
              {job.tags && job.tags.length > 0 && (
                <div className="pt-6 border-t border-border/60 space-y-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="size-3.5 text-sky-400" />
                    <span>Demonstrable Technical Competencies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-secondary/60 border border-border/70 text-foreground flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="size-3 text-sky-400" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Compensation & Rewards Architecture */}
          <section
            id="compensation"
            className="p-6 sm:p-10 rounded-3xl bg-card/60 border border-border/80 space-y-7 shadow-xs scroll-mt-20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-3">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <Coins className="size-6 text-sky-400" />
                  <span>Compensation & Total Rewards</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Transparent base pay, equity upside, and variable performance incentives
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 self-start sm:self-auto">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>Transparent Pay Disclosed</span>
              </span>
            </div>

            {/* Visual Salary Meter */}
            {job.minSalary && job.maxSalary && (
              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/70 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Minimum Band</span>
                  <span className="text-foreground font-bold">Target Hiring Band</span>
                  <span>Maximum Band</span>
                </div>
                <div className="h-3 w-full rounded-full bg-secondary overflow-hidden flex shadow-inner">
                  <div className="h-full bg-linear-to-r from-sky-500 via-indigo-500 to-emerald-500 rounded-full w-full" />
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-foreground font-mono">
                  <span>{currencySymbol}{job.minSalary.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground font-sans">Annual Base ({currencyCode})</span>
                  <span>{currencySymbol}{job.maxSalary.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* 3 Component Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/70 space-y-2">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Base Salary
                </div>
                <div className="text-xl font-black text-foreground">
                  {job.minSalary && job.maxSalary
                    ? `${currencySymbol}${(job.minSalary / 1000).toFixed(0)}k – ${currencySymbol}${(job.maxSalary / 1000).toFixed(0)}k`
                    : job.minSalary
                    ? `From ${currencySymbol}${(job.minSalary / 1000).toFixed(0)}k`
                    : "Competitive Base"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currencyCode} {salaryPeriodLabel}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/70 space-y-2">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Equity Incentive
                </div>
                <div className="text-xl font-black text-foreground">
                  {job.hasEquity ? (job.equityRange || "Equity Included") : "Not Applicable"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {job.hasEquity ? "RSUs / ISO stock options" : "Cash-only compensation"}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/70 space-y-2">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Variable & Sign-On
                </div>
                <div className="text-xl font-black text-foreground">
                  {job.hasSignOnBonus && job.signOnBonus
                    ? `${currencySymbol}${job.signOnBonus.toLocaleString()} Sign-On`
                    : job.annualBonusPercentage
                    ? `${job.annualBonusPercentage}% Target Bonus`
                    : "Discretionary"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {job.annualBonusPercentage && job.hasSignOnBonus
                    ? `+ ${job.annualBonusPercentage}% annual target`
                    : "Performance based incentives"}
                </div>
              </div>
            </div>

            {/* Compensation Philosophy */}
            <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/20 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <TrendingUp className="size-4 text-sky-400" />
                <span>Compensation Philosophy</span>
              </div>
              <p>
                {job.compensationNotes ||
                  "Our disclosed compensation reflects expected base cash compensation for this role. Actual placement within this band is calibrated against verified technical depth, candidate seniority, demonstrable market competencies, and location."}
              </p>
            </div>
          </section>

          {/* Perks & Benefits Bento Grid */}
          {((job.benefits && job.benefits.length > 0) || (job.company?.benefits && job.company.benefits.length > 0)) && (
            <section className="p-6 sm:p-10 rounded-3xl bg-card/60 border border-border/80 space-y-6 shadow-xs">
              <div className="pb-4 border-b border-border/60 space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <Sparkles className="size-6 text-sky-400" />
                  <span>Corporate Perks & Wellness Benefits</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Comprehensive benefits package extended to permanent full-time hires
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(job.benefits && job.benefits.length > 0 ? job.benefits : job.company?.benefits || []).map((bKey) => {
                  const meta = COMPANY_BENEFITS.find((b) => b.key === bKey);
                  return (
                    <div
                      key={bKey}
                      className="p-5 rounded-2xl bg-secondary/30 border border-border/70 space-y-1.5 hover:border-sky-500/30 transition-colors"
                    >
                      <div className="text-sm font-bold text-foreground flex items-center gap-2">
                        <span className="size-2 rounded-full bg-sky-400" />
                        <span>{meta ? meta.label : bKey.replace(/_/g, " ")}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                        {meta?.description || "Corporate benefit provided to full-time team members."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bottom Application Call-to-Action Banner */}
          <section className="p-8 sm:p-10 rounded-3xl bg-linear-to-r from-card via-card/90 to-secondary/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-black tracking-tight text-foreground">
                Interested in leading this mission?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Submit your credentials directly to the hiring managers at {job.company?.name || "Innovate Systems"}. Your application is reviewed by actual technical leads.
              </p>
            </div>
            {!hasApplied && (
              <Button
                onClick={handleApplyClick}
                className="h-12 px-8 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 shrink-0 transition-all cursor-pointer"
              >
                <span>{isAuthenticated ? "Submit Candidacy" : "Sign In to Apply"}</span>
              </Button>
            )}
          </section>
        </div>

        {/* Right 4 Columns: Sticky Quick Action & Organization Sidebar */}
        <div className="lg:col-span-4 sticky top-16 space-y-6">
          {/* Sticky Quick-Apply Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-card/80 border border-border/80 backdrop-blur-md shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Direct Submission
              </div>
              <div className="text-xl font-bold text-foreground">
                Apply for Position
              </div>
              <div className="text-xs text-muted-foreground">
                Average review timeframe: 2-3 business days
              </div>
            </div>

            {/* Compensation & Location Summary */}
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Compensation</span>
                <span className="text-foreground font-bold font-mono">
                  {job.minSalary && job.maxSalary
                    ? `${currencySymbol}${(job.minSalary / 1000).toFixed(0)}k – ${(job.maxSalary / 1000).toFixed(0)}k`
                    : "Disclosed Band"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="text-foreground font-medium truncate max-w-[150px]">
                  {job.location}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Workplace</span>
                <span className="text-foreground font-medium capitalize">
                  {job.workplaceType.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Application Action Button */}
            <div>
              {job.expired ? (
                <Button
                  disabled
                  variant="outline"
                  className="w-full h-11 text-xs font-semibold rounded-xl opacity-60 cursor-not-allowed"
                >
                  Position Closed
                </Button>
              ) : hasApplied ? (
                <div className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-4" />
                  <span>Application Submitted</span>
                </div>
              ) : canQuickApply ? (
                <div className="space-y-2">
                  <Button
                    onClick={handleQuickApply}
                    disabled={submitMutation.isPending}
                    className="w-full h-11 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-xs rounded-xl shadow-md gap-2 cursor-pointer"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Zap className="size-4 fill-current" />
                    )}
                    <span>1-Click Quick Apply</span>
                  </Button>
                  <Button
                    onClick={handleApplyClick}
                    variant="outline"
                    className="w-full h-10 text-xs font-semibold rounded-xl border-border/80 hover:bg-secondary/60"
                  >
                    Apply with Custom Resume
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleApplyClick}
                  className="w-full h-12 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-md shadow-sky-500/20 gap-2 cursor-pointer"
                >
                  <Send className="size-4" />
                  <span>{isAuthenticated ? "Apply Now" : "Sign In to Apply"}</span>
                </Button>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground text-center">
              Protected by cryptographic identity verification
            </div>
          </div>

          {/* About the Hiring Company Card */}
          <div
            id="company"
            className="p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 space-y-5 shadow-xs scroll-mt-20"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-linear-to-br from-sky-500/15 via-card to-indigo-500/15 border border-sky-500/20 text-sky-400 font-bold text-lg flex items-center justify-center shrink-0">
                {companyInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base text-foreground truncate">
                  {job.company?.name}
                </div>
                {job.company?.industry && (
                  <div className="text-xs text-muted-foreground truncate">
                    {job.company.industry}
                  </div>
                )}
              </div>
            </div>

            {job.company?.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                {job.company.description}
              </p>
            )}

            <div className="pt-3 border-t border-border/60 space-y-2.5 text-xs">
              {job.company?.companySize && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="text-foreground font-medium">{job.company.companySize}</span>
                </div>
              )}
              {job.company?.location && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Headquarters</span>
                  <span className="text-foreground font-medium truncate max-w-[160px]">
                    {job.company.location}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verification</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  <span>Verified Organization</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {job.company?.slug && (
                <Link
                  href={`/companies/${job.company.slug}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-secondary/80 hover:bg-secondary text-xs font-semibold text-foreground transition-colors"
                >
                  <span>Explore Company Profile</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
              {job.company?.website && (
                <a
                  href={job.company.website.startsWith("http") ? job.company.website : `https://${job.company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="size-3.5" />
                  <span>Visit Corporate Site</span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </a>
              )}
            </div>
          </div>

          {/* Direct Employer Guarantee */}
          <div className="p-6 rounded-3xl bg-card/60 border border-border/80 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
              <ShieldCheck className="size-4" />
              <span>Direct Recruitment Guarantee</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This opening is posted and reviewed directly by verified corporate hiring managers at{" "}
              <strong className="text-foreground font-semibold">{job.company?.name || "the hiring organization"}</strong>.
              No agency intermediaries, recruiting scrapers, or third-party fee markups.
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

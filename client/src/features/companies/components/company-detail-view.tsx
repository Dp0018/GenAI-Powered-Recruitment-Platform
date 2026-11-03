"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePublicCompanyQuery } from "../hooks/use-companies";
import { JobCard } from "@/features/jobs/components/job-card";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  Share2,
  Check,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_BENEFITS } from "@/features/jobs/types/benefits";

interface CompanyDetailViewProps {
  slug: string;
}

export function CompanyDetailView({ slug }: CompanyDetailViewProps) {
  const { data, isLoading, isError, error } = usePublicCompanyQuery(slug);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-56 sm:h-72 rounded-3xl bg-card/60 border border-border" />
        <div className="flex gap-4 items-center px-4">
          <div className="size-24 rounded-2xl bg-muted/40 border border-border" />
          <div className="space-y-2">
            <div className="h-7 w-56 bg-muted/40 rounded-lg" />
            <div className="h-4 w-36 bg-muted/30 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-card/50 rounded-2xl border border-border" />
            <div className="h-64 bg-card/50 rounded-2xl border border-border" />
          </div>
          <div className="h-80 bg-card/50 rounded-2xl border border-border" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto space-y-4">
        <div className="size-16 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mb-2 shadow-inner">
          <Building2 className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Organization Not Found</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error instanceof Error ? error.message : "The requested company profile does not exist or may have been unlisted."}
        </p>
        <div className="pt-2">
          <Link href="/jobs">
            <Button className="h-10 px-6 bg-primary text-primary-foreground font-semibold rounded-xl">
              Explore Open Positions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { company, openJobs } = data;
  const isVerified = company.verificationStatus === "VERIFIED";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Hero Banner Container */}
        <div className="relative rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-linear-to-br from-slate-900 via-indigo-950/50 to-slate-950">
          {/* Background Visual Layer */}
          {company.bannerUrl ? (
            <Image
              src={company.bannerUrl}
              alt={`${company.name} cover`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0">
              {/* Dynamic Gradient Mesh & Ambient Glowing Nodes */}
              <div className="absolute -top-24 -right-24 size-96 rounded-full bg-sky-500/15 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-indigo-500/15 blur-3xl" />
              <div className="absolute top-1/2 left-1/3 size-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px] opacity-40" />
            </div>
          )}

          {/* Shading Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

          {/* Banner Internal Content */}
          <div className="relative z-10 pt-16 sm:pt-24 pb-8 px-6 sm:px-10 flex flex-col justify-end min-h-[220px] sm:min-h-[260px]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* Left Logo + Name Block */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                {/* Logo Box */}
                <div className="size-24 sm:size-28 rounded-2xl bg-card border-2 border-border/90 shadow-2xl overflow-hidden relative flex items-center justify-center shrink-0 backdrop-blur-xl">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      fill
                      className="object-cover p-2"
                    />
                  ) : (
                    <div className="size-full flex flex-col items-center justify-center bg-linear-to-br from-sky-500/20 via-sky-500/10 to-indigo-500/20 text-sky-400">
                      <Building2 className="size-11" />
                    </div>
                  )}
                </div>

                {/* Company Title & Key Metadata */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                      {company.name}
                    </h1>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                        <CheckCircle2 className="size-3.5" />
                        <span>Verified Entity</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/80 text-muted-foreground border border-border">
                        <ShieldCheck className="size-3.5" />
                        <span>Registered Employer</span>
                      </span>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground pt-0.5">
                    {company.industry && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60 text-foreground font-medium">
                        <Briefcase className="size-3.5 text-sky-400" />
                        {company.industry}
                      </span>
                    )}
                    {company.location && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60 text-foreground font-medium">
                        <MapPin className="size-3.5 text-sky-400" />
                        {company.location}
                      </span>
                    )}
                    {company.companySize && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60 text-foreground font-medium">
                        <Users className="size-3.5 text-sky-400" />
                        {company.companySize} employees
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="h-10 px-3.5 rounded-xl border-border/80 bg-secondary/50 hover:bg-secondary text-xs font-medium gap-2 cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5 text-muted-foreground" />}
                  <span>{copied ? "Copied Link" : "Share"}</span>
                </Button>

                {company.website && (
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="h-10 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs gap-2 shadow-xs cursor-pointer"
                    >
                      <Globe className="size-3.5" />
                      <span>Visit Website</span>
                      <ExternalLink className="size-3.5 opacity-70" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview / About Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card/80 border border-border/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2.5">
                  <Sparkles className="size-4 text-sky-400" />
                  <span>About {company.name}</span>
                </h2>
                <span className="text-xs text-muted-foreground font-mono">Company Overview</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {company.description ||
                  `${company.name} is a verified employer on JobPortal actively seeking top-tier talent. Explore their open jobs below or connect directly through their website.`}
              </p>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                    <span>Verified Employer</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Business credentials verified by platform administration.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Zap className="size-3.5 text-sky-400" />
                    <span>Direct Hiring</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Applications routed straight to internal recruiters.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Award className="size-3.5 text-indigo-400" />
                    <span>Fair Pay Policy</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Committed to competitive compensation standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits & Culture Badges */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="p-6 sm:p-7 rounded-3xl bg-card/80 border border-border/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2.5">
                    <Award className="size-4 text-emerald-400" />
                    <span>Perks & Employee Benefits</span>
                  </h2>
                  <span className="text-xs text-muted-foreground font-mono">
                    {company.benefits.length} Benefits Offered
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {company.benefits.map((bKey) => {
                    const meta = COMPANY_BENEFITS.find((b) => b.key === bKey);
                    return (
                      <div
                        key={bKey}
                        className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-1.5 transition-all hover:bg-secondary/60"
                      >
                        <div className="text-xs font-bold text-foreground flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-sky-400" />
                          <span>{meta ? meta.label : bKey.replace(/_/g, " ")}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed pl-3.5">
                          {meta?.description || "Corporate benefit package provided to verified hires."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Openings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2.5">
                    <Layers className="size-4.5 text-sky-400" />
                    <span>Open Positions</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {openJobs.length} open position{openJobs.length === 1 ? "" : "s"} currently accepting applications
                  </p>
                </div>
              </div>

              {openJobs.length === 0 ? (
                <div className="p-12 rounded-3xl bg-card/60 border border-dashed border-border text-center space-y-3">
                  <div className="size-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
                    <Briefcase className="size-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">No open positions right now</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {company.name} does not have any active openings listed at this moment. Check back soon or explore other opportunities on the job board.
                  </p>
                  <div className="pt-2">
                    <Link href="/jobs">
                      <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-xs font-medium border-border">
                        Browse All Jobs
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {openJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Organization Profile Details Card */}
            <div className="p-6 rounded-3xl bg-card/80 border border-border/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
                <Building2 className="size-4 text-sky-400" />
                <span>Organization Profile</span>
              </h3>
              <div className="space-y-3 text-xs divide-y divide-border/60">
                <div className="flex justify-between items-center py-2.5 first:pt-0">
                  <span className="text-muted-foreground">Headquarters</span>
                  <span className="font-medium text-foreground">{company.location || "Worldwide"}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium text-foreground">{company.industry || "Technology"}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-muted-foreground">Company Size</span>
                  <span className="font-medium text-foreground">{company.companySize || "Not specified"}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-muted-foreground">Trust Tier</span>
                  <span className="font-medium text-foreground">
                    {isVerified ? "Verified Enterprise" : "Standard Registered"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-muted-foreground">Active Openings</span>
                  <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                    {openJobs.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Application Banner */}
            <div className="p-6 rounded-3xl bg-linear-to-br from-sky-500/10 via-card to-indigo-500/10 border border-sky-500/20 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-sky-400">
                <Zap className="size-3.5" />
                <span>Direct Application</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Applications submitted through JobPortal are routed straight to {company.name}&apos;s verified recruitment team with instant status synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

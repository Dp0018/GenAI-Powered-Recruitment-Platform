"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePublicCompanyQuery } from "../hooks/use-companies";
import { JobItem } from "@/features/jobs/types/job";
import { ApplyJobModal } from "@/features/applications/components/apply-job-modal";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_BENEFITS } from "@/features/jobs/types/benefits";

interface CompanyDetailViewProps {
  slug: string;
}

export function CompanyDetailView({ slug }: CompanyDetailViewProps) {
  const { data, isLoading, isError, error } = usePublicCompanyQuery(slug);
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobItem | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 sm:h-64 rounded-2xl bg-muted/30 border border-border" />
        <div className="flex gap-4 items-center">
          <div className="size-20 rounded-2xl bg-muted/40 border border-border" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted/40 rounded" />
            <div className="h-4 w-32 bg-muted/30 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-32 bg-muted/30 rounded-xl" />
            <div className="h-48 bg-muted/30 rounded-xl" />
          </div>
          <div className="h-64 bg-muted/30 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <Building2 className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Organization Not Found</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          {error instanceof Error ? error.message : "The requested company profile does not exist or may have been unlisted."}
        </p>
        <Link href="/jobs" className="mt-6">
          <Button variant="outline" className="border-border">
            Explore Open Positions
          </Button>
        </Link>
      </div>
    );
  }

  const { company, openJobs } = data;
  const isVerified = company.verificationStatus === "VERIFIED";

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Cover Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900">
          {company.bannerUrl ? (
            <Image
              src={company.bannerUrl}
              alt={`${company.name} cover`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        </div>

        {/* Profile Floating Card Header */}
        <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Logo */}
              <div className="size-24 sm:size-28 rounded-2xl bg-card border-2 border-border shadow-xl overflow-hidden relative flex items-center justify-center shrink-0">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    fill
                    className="object-cover p-1.5"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                    <Building2 className="size-12" />
                  </div>
                )}
              </div>

              {/* Title and Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {company.name}
                  </h1>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                      <CheckCircle2 className="size-3.5" />
                      Verified Entity
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-secondary text-muted-foreground border border-border">
                      <ShieldCheck className="size-3.5" />
                      Pending Verification
                    </span>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground pt-1">
                  {company.industry && (
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="size-3.5 text-primary" />
                      {company.industry}
                    </span>
                  )}
                  {company.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" />
                      {company.location}
                    </span>
                  )}
                  {company.companySize && (
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5 text-primary" />
                      {company.companySize}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* External Website Button */}
            {company.website && (
              <a
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="gap-2 border-border font-mono text-xs">
                  <Globe className="size-3.5" />
                  <span>Visit Website</span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview / About */}
            <div className="p-6 rounded-2xl bg-card/60 border border-border space-y-3">
              <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>About {company.name}</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {company.description || "This organization has not added a detailed public overview yet."}
              </p>
            </div>

            {/* Benefits & Culture Badges */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="p-6 rounded-2xl bg-card/60 border border-border space-y-4">
                <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span>Company Perks & Employee Benefits</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {company.benefits.map((bKey) => {
                    const meta = COMPANY_BENEFITS.find((b) => b.key === bKey);
                    return (
                      <div
                        key={bKey}
                        className="p-3.5 rounded-xl bg-secondary/40 border border-border space-y-1"
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
              </div>
            )}

            {/* Active Requisitions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    <span>Open Positions</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {openJobs.length} active requisition{openJobs.length === 1 ? "" : "s"} hiring right now
                  </p>
                </div>
              </div>

              {openJobs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-card/40 border border-dashed border-border text-center space-y-2">
                  <Briefcase className="size-8 mx-auto text-muted-foreground/60" />
                  <p className="text-sm font-medium text-foreground">No open positions at this time</p>
                  <p className="text-xs text-muted-foreground">
                    Check back soon or explore other opportunities on the jobs board.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-5 rounded-xl bg-card/70 border border-border hover:border-primary/40 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <Link href={`/jobs/${job.slug}`}>
                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                          <span className="inline-flex items-center gap-1 font-mono">
                            <MapPin className="size-3 text-primary" />
                            {job.location} ({job.workplaceType})
                          </span>
                          {job.minSalary && (
                            <span className="font-mono text-foreground font-semibold">
                              ${job.minSalary.toLocaleString()} - ${job.maxSalary?.toLocaleString() || ""} {job.currency || "USD"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
                        <Link href={`/jobs/${job.slug}`}>
                          <Button variant="ghost" size="sm" className="text-xs font-mono text-muted-foreground">
                            Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => setSelectedJobToApply(job)}
                          className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        >
                          <span>Apply</span>
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Highlights */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card/70 border border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground tracking-tight">Organization Profile</h3>
              <div className="space-y-3 text-xs divide-y divide-border/60">
                <div className="flex justify-between items-center py-2 first:pt-0">
                  <span className="text-muted-foreground">Headquarters</span>
                  <span className="font-medium text-foreground">{company.location || "Worldwide"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium text-foreground">{company.industry || "Technology"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-medium text-foreground">{company.companySize || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Trust Tier</span>
                  <span className="font-medium text-foreground">
                    {isVerified ? "Verified Enterprise" : "Standard Registered"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Total Open Roles</span>
                  <span className="font-mono font-bold text-primary">{openJobs.length}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 space-y-2">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-primary">Direct Application</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All submissions made on this page are delivered immediately to {company.name}&apos;s verified recruitment dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Application Modal */}
      {selectedJobToApply && (
        <ApplyJobModal
          jobId={selectedJobToApply.id}
          jobTitle={selectedJobToApply.title}
          companyName={company.name}
          open={Boolean(selectedJobToApply)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedJobToApply(null);
          }}
        />
      )}
    </div>
  );
}

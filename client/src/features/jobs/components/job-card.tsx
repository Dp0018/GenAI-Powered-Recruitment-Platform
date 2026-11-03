"use client";

import React from "react";
import Link from "next/link";
import { JobItem } from "../types/job";
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { BookmarkButton } from "./bookmark-button";
import { SkillsMatchBadge } from "./skills-match-badge";
import { JobFraudShieldBadge } from "@/features/ai/components/job-fraud-shield-badge";

interface JobCardProps {
  job: JobItem;
}

export function JobCard({ job }: JobCardProps) {
  const isVerified = job.company?.verificationStatus === "VERIFIED";
  const isQuickApply =
    !job.expired &&
    (!job.screeningQuestions ||
      job.screeningQuestions.filter((q) => q.required).length === 0);

  const getExpirationBadge = () => {
    if (job.expired) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-destructive bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="size-3" />
          <span>Expired</span>
        </span>
      );
    }
    if (job.expiresAt) {
      const msLeft = new Date(job.expiresAt).getTime() - Date.now();
      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7 && daysLeft > 0) {
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/25">
            <Clock className="size-3" />
            <span>Expires in {daysLeft}d</span>
          </span>
        );
      }
    }
    return null;
  };

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="block p-5 sm:p-6 rounded-xl bg-card/90 border border-border/80 hover:border-sky-500/50 transition-all shadow-xs hover:shadow-lg group text-left relative"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        {/* Left: Company & Badges */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-semibold text-sky-400 font-mono flex items-center gap-1.5 shrink-0">
              <Building2 className="size-3.5 sm:size-4 text-sky-400" />
              <span>{job.company?.name || "Company"}</span>
            </span>

            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                <CheckCircle2 className="size-3 text-emerald-400" />
                <span>Verified Company</span>
              </span>
            )}

            {isQuickApply && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/25">
                <Zap className="size-2.5 fill-current text-amber-400" />
                <span>Quick Apply</span>
              </span>
            )}
          </div>

          {/* Secondary Badges: AI Trust & Skills Match */}
          <div className="flex items-center flex-wrap gap-2 pt-0.5">
            <JobFraudShieldBadge
              fraudScore={job.fraudRiskScore ?? 5}
              fraudReasons={job.fraudReasons ?? undefined}
              isQuarantined={job.isQuarantined ?? false}
            />
            <SkillsMatchBadge jobId={job.id} />
            {getExpirationBadge()}
          </div>
        </div>

        {/* Right: Salary, Bookmark, Location & Level */}
        <div className="text-left sm:text-right shrink-0 flex flex-col items-start sm:items-end">
          <div className="flex items-center sm:justify-end gap-2">
            {job.minSalary && job.maxSalary ? (
              <div className="font-mono text-sm sm:text-base font-bold text-foreground tracking-tight whitespace-nowrap">
                £{(job.minSalary / 1000).toFixed(0)}k - £{(job.maxSalary / 1000).toFixed(0)}k{" "}
                <span className="text-[10px] sm:text-xs font-normal text-muted-foreground uppercase">
                  {job.currency && job.currency !== "USD" ? job.currency : "GBP"} /{job.salaryPeriod === "HOURLY" ? "hr" : job.salaryPeriod === "MONTHLY" ? "mo" : "yr"}
                </span>
              </div>
            ) : job.minSalary ? (
              <div className="font-mono text-sm sm:text-base font-bold text-foreground tracking-tight whitespace-nowrap">
                From £{(job.minSalary / 1000).toFixed(0)}k{" "}
                <span className="text-[10px] sm:text-xs font-normal text-muted-foreground uppercase">
                  {job.currency && job.currency !== "USD" ? job.currency : "GBP"} /{job.salaryPeriod === "HOURLY" ? "hr" : job.salaryPeriod === "MONTHLY" ? "mo" : "yr"}
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                Salary Not Disclosed
              </span>
            )}

            <BookmarkButton
              jobId={job.id}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
            />
          </div>

          {/* Location */}
          <div className="flex items-center sm:justify-end gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="size-3 text-muted-foreground shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>

          {/* Experience Level & Workplace Pill */}
          <div className="flex items-center sm:justify-end gap-1.5 font-mono text-[10px] mt-1">
            {job.experienceLevel && (
              <span className="px-1.5 py-0.5 rounded bg-secondary/80 border border-border text-muted-foreground uppercase font-medium">
                {job.experienceLevel.replace("_", " ")}
              </span>
            )}
            <span className="font-semibold text-sky-400 uppercase tracking-wide">
              [{job.workplaceType}]
            </span>
          </div>
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-sky-400 transition-colors mt-3">
        {job.title}
      </h3>

      {/* Description Snippet */}
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-1.5 max-w-2xl">
        {job.description}
      </p>

      {/* Skill Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-1">
          {job.tags.slice(0, 5).map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded bg-secondary/60 border border-border/80 text-[11px] sm:text-xs font-mono text-muted-foreground group-hover:border-border transition-colors"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 5 && (
            <span className="text-[10px] font-mono text-muted-foreground self-center">
              +{job.tags.length - 5} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

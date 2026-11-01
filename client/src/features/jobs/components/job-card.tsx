"use client";

import React from "react";
import Link from "next/link";
import { JobItem } from "../types/job";
import {
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
} from "lucide-react";
import { BookmarkButton } from "./bookmark-button";
import { getBenefitLabel } from "../types/benefits";
import { SkillsMatchBadge } from "./skills-match-badge";

interface JobCardProps {
  job: JobItem;
}

export function JobCard({ job }: JobCardProps) {
  const isVerified = job.company?.verificationStatus === "VERIFIED";

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
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40">
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
      className="block p-5 sm:p-6 rounded-xl bg-card/70 border border-border hover:border-primary/50 transition-all shadow-xs hover:shadow-md group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Company Badge & Expiration */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-semibold text-primary font-mono flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary" />
              <span>{job.company?.name || "Verified Organization"}</span>
            </span>
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                <CheckCircle2 className="size-3" />
                <span>Verified Entity</span>
              </span>
            )}
            {getExpirationBadge()}
            {!job.expired && (!job.screeningQuestions || job.screeningQuestions.filter((q) => q.required).length === 0) && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 font-semibold">
                <Zap className="size-2.5 fill-current" />
                <span>Quick Apply</span>
              </span>
            )}
            <SkillsMatchBadge jobId={job.id} />
          </div>

          {/* Job Title */}
          <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl">
            {job.description}
          </p>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-secondary/80 border border-border text-[11px] font-mono text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 4 && (
                <span className="text-[10px] font-mono text-muted-foreground self-center">
                  +{job.tags.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Benefits Preview */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-mono text-muted-foreground/80 flex items-center gap-1">
                <Sparkles className="size-2.5 text-primary" />
                <span>Perks:</span>
              </span>
              {job.benefits.slice(0, 3).map((b, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-medium text-primary"
                >
                  {getBenefitLabel(b)}
                </span>
              ))}
              {job.benefits.length > 3 && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  +{job.benefits.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Info: Comp, Location, Workplace & Bookmark */}
        <div className="sm:text-right shrink-0 flex sm:flex-col justify-between sm:justify-start items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <div className="flex items-center gap-2">
            <div>
              {job.minSalary && job.maxSalary ? (
                <div className="font-mono text-sm font-bold text-foreground">
                  ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k{" "}
                  <span className="text-[10px] text-muted-foreground">
                    {job.currency} {job.salaryPeriod === "HOURLY" ? "/hr" : job.salaryPeriod === "MONTHLY" ? "/mo" : "/yr"}
                  </span>
                </div>
              ) : job.minSalary ? (
                <div className="font-mono text-sm font-bold text-foreground">
                  From ${(job.minSalary / 1000).toFixed(0)}k{" "}
                  <span className="text-[10px] text-muted-foreground">
                    {job.currency} {job.salaryPeriod === "HOURLY" ? "/hr" : job.salaryPeriod === "MONTHLY" ? "/mo" : "/yr"}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-muted-foreground">Competitive Compensation</span>
              )}
              {/* Equity & Bonus Badges for Pay Transparency */}
              {(job.hasEquity || job.hasSignOnBonus) && (
                <div className="flex flex-wrap items-center justify-end gap-1 pt-1">
                  {job.hasEquity && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                      + Equity
                    </span>
                  )}
                  {job.hasSignOnBonus && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-indigo-400 bg-indigo-950/40 border border-indigo-800/40">
                      + Bonus
                    </span>
                  )}
                </div>
              )}
            </div>
            <BookmarkButton jobId={job.id} size="sm" variant="ghost" className="h-7 w-7 p-0" />
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground" />
              <span>{job.location}</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {job.experienceLevel && (
                <span className="text-secondary-foreground bg-secondary px-1.5 py-0.2 rounded border border-border">
                  {job.experienceLevel.replace("_", " ")}
                </span>
              )}
              <span className="uppercase tracking-wider text-primary font-medium">
                [{job.workplaceType}]
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

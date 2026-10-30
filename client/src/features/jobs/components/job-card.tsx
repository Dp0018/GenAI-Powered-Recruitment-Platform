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
} from "lucide-react";

interface JobCardProps {
  job: JobItem;
}

export function JobCard({ job }: JobCardProps) {
  const isVerified = job.company?.verificationStatus === "VERIFIED";

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="block p-5 sm:p-6 rounded-xl bg-card/70 border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Company Badge */}
          <div className="flex items-center gap-2">
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
        </div>

        {/* Right Info: Comp, Location, Workplace */}
        <div className="sm:text-right shrink-0 flex sm:flex-col justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <div>
            {job.minSalary && job.maxSalary ? (
              <div className="font-mono text-sm font-bold text-foreground">
                ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k{" "}
                <span className="text-[10px] text-muted-foreground">{job.currency}</span>
              </div>
            ) : job.minSalary ? (
              <div className="font-mono text-sm font-bold text-foreground">
                From ${(job.minSalary / 1000).toFixed(0)}k{" "}
                <span className="text-[10px] text-muted-foreground">{job.currency}</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-muted-foreground">Competitive Compensation</span>
            )}
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground" />
              <span>{job.location}</span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-medium">
              [{job.workplaceType}]
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

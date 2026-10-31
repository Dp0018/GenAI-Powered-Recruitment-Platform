"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSavedJobsQuery, useToggleSaveJobMutation } from "@/features/jobs/hooks/use-jobs";
import { JobItem } from "@/features/jobs/types/job";
import { ApplyJobModal } from "@/features/applications/components/apply-job-modal";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Trash2,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function CandidateSavedJobsTab() {
  const { data, isLoading } = useSavedJobsQuery();
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobItem | null>(null);

  const savedJobs = data?.content || [];
  const totalElements = data?.totalElements || 0;

  if (isLoading) {
    return (
      <div className="p-12 text-center rounded-xl border border-border bg-card/40 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary mx-auto" />
        <div className="text-xs text-muted-foreground font-mono">Loading saved bookmarks...</div>
      </div>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card/40 space-y-3">
        <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <Bookmark className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">No saved positions yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click the bookmark icon on any job card across the portal to save opportunities and apply later.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/jobs">
            <Button size="sm" variant="outline" className="border-border text-xs gap-1.5 font-mono">
              <span>Explore Live Openings</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
            <Bookmark className="size-4 text-primary fill-primary" />
            <span>Saved Job Positions</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bookmarked opportunities saved for later review or application.
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
          {totalElements} Saved
        </span>
      </div>

      <div className="space-y-3">
        {savedJobs.map((job) => (
          <SavedJobCard
            key={job.id}
            job={job}
            onApply={() => setSelectedJobToApply(job)}
          />
        ))}
      </div>

      {selectedJobToApply && (
        <ApplyJobModal
          jobId={selectedJobToApply.id}
          jobTitle={selectedJobToApply.title}
          companyName={selectedJobToApply.company?.name || "Corporate Employer"}
          open={Boolean(selectedJobToApply)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedJobToApply(null);
          }}
        />
      )}
    </div>
  );
}

function SavedJobCard({ job, onApply }: { job: JobItem; onApply: () => void }) {
  const toggleMutation = useToggleSaveJobMutation(job.id);
  const isVerified = job.company?.verificationStatus === "VERIFIED";

  return (
    <div className="p-5 rounded-xl bg-card/70 border border-border hover:border-primary/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      <div className="space-y-2 max-w-xl">
        {/* Company Badge with Link */}
        <div className="flex items-center gap-2">
          {job.company?.slug ? (
            <Link
              href={`/companies/${job.company.slug}`}
              className="text-xs font-semibold text-primary hover:underline font-mono flex items-center gap-1.5"
            >
              <Building2 className="size-3.5 text-primary" />
              <span>{job.company.name}</span>
            </Link>
          ) : (
            <span className="text-xs font-semibold text-primary font-mono flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary" />
              <span>{job.company?.name || "Corporate Employer"}</span>
            </span>
          )}
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
              <CheckCircle2 className="size-3" />
              <span>Verified Entity</span>
            </span>
          )}
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.slug}`}>
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {job.title}
          </h3>
        </Link>

        {/* Metadata pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-mono">
            <MapPin className="size-3 text-primary" />
            {job.location} [{job.workplaceType}]
          </span>
          {job.minSalary && (
            <span className="font-mono text-foreground font-semibold">
              ${job.minSalary.toLocaleString()} - ${job.maxSalary?.toLocaleString() || ""} {job.currency || "USD"}
            </span>
          )}
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-secondary/80 border border-border text-[11px] font-mono text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
        <Button
          variant="ghost"
          size="sm"
          disabled={toggleMutation.isPending}
          onClick={() => toggleMutation.mutate()}
          className="text-xs font-mono text-destructive hover:bg-destructive/10 gap-1.5 h-8"
        >
          {toggleMutation.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
          <span>Remove</span>
        </Button>

        <Link href={`/jobs/${job.slug}`}>
          <Button variant="outline" size="sm" className="text-xs font-mono border-border h-8">
            Details
          </Button>
        </Link>

        <Button
          size="sm"
          onClick={onApply}
          className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground h-8 shadow-sm"
        >
          <span>Apply</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

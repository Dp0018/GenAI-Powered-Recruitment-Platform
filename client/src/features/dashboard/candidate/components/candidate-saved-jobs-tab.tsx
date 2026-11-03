"use client";

import React from "react";
import Link from "next/link";
import { useSavedJobsQuery } from "@/features/jobs/hooks/use-jobs";
import { JobCard } from "@/features/jobs/components/job-card";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowRight, Loader2 } from "lucide-react";

export function CandidateSavedJobsTab() {
  const { data, isLoading } = useSavedJobsQuery();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

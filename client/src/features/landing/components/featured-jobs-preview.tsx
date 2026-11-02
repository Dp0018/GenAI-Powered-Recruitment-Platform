"use client";

import React from "react";
import Link from "next/link";
import { useJobsQuery } from "@/features/jobs/hooks/use-jobs";
import { JobCard } from "@/features/jobs/components/job-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Briefcase, Loader2 } from "lucide-react";

export function FeaturedJobsPreview() {
  const { data, isLoading } = useJobsQuery({
    page: 0,
    size: 4,
    sortBy: "NEWEST",
  });

  const jobs = data?.content || [];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-secondary/10">
      <div className="container mx-auto max-w-6xl space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span>Hand-Picked Requisitions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Featured Job Drops
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Freshly verified roles posted by top hiring teams with guaranteed response times.
            </p>
          </div>

          <Link href="/jobs">
            <Button variant="outline" className="gap-2 font-medium">
              <span>Explore All Jobs</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-7 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground font-mono">Loading featured roles...</span>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl border border-dashed border-border bg-card/40 text-center space-y-3">
            <Briefcase className="size-8 text-primary mx-auto opacity-70" />
            <h3 className="font-bold text-base text-foreground">Discover Open Positions</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Browse through our live database of vetted software, product, and leadership openings.
            </p>
            <div className="pt-2">
              <Link href="/jobs">
                <Button size="sm" className="gap-1.5">
                  <span>Browse Job Board</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-bold text-sm text-foreground">
              Want jobs delivered directly to your inbox?
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Set custom filters and get notified the minute matching roles go live.
            </div>
          </div>
          <Link href="/register">
            <Button size="sm" className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium shrink-0">
              Create Free Job Alert
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

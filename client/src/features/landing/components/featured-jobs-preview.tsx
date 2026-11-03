"use client";

import React from "react";
import Link from "next/link";
import { useJobsQuery } from "@/features/jobs/hooks/use-jobs";
import { JobCard } from "@/features/jobs/components/job-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Loader2 } from "lucide-react";

export function FeaturedJobsPreview() {
  const { data, isLoading } = useJobsQuery({
    page: 0,
    size: 4,
    sortBy: "NEWEST",
  });

  const jobs = data?.content || [];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-secondary/10">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Recent Openings
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Featured positions
            </h2>
            <p className="text-sm text-muted-foreground">
              Verified roles posted directly by active hiring teams.
            </p>
          </div>

          <Link href="/jobs">
            <Button variant="outline" size="sm" className="gap-1.5 font-medium text-xs">
              <span>View all openings</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Loading recent roles...</span>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-xl border border-dashed border-border bg-card/40 text-center space-y-3">
            <Briefcase className="size-7 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-sm text-foreground">No featured positions currently</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Check our full job board for new openings across all engineering and product teams.
            </p>
            <div className="pt-1">
              <Link href="/jobs">
                <Button size="sm" className="gap-1.5 text-xs">
                  <span>Browse all jobs</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

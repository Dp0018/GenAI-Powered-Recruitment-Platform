"use client";

import React, { useState } from "react";
import { useJobsQuery } from "../hooks/use-jobs";
import { JobCard } from "./job-card";
import { JobItem } from "../types/job";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, SlidersHorizontal, Loader2, Briefcase, Sparkles } from "lucide-react";

export function PublicJobsBoard() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [workplaceType, setWorkplaceType] = useState("ALL");
  const [jobType, setJobType] = useState("ALL");

  // Debounced search state passed to TanStack Query
  const [activeParams, setActiveParams] = useState({
    query: "",
    location: "all",
    workplaceType: "ALL",
    jobType: "ALL",
  });

  const { data, isLoading, isError, refetch } = useJobsQuery(activeParams);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveParams({
      query: query.trim(),
      location,
      workplaceType,
      jobType,
    });
  };

  const handleQuickTag = (tag: string) => {
    setQuery(tag);
    setActiveParams((prev) => ({ ...prev, query: tag }));
  };

  const jobs: JobItem[] = (data?.content as JobItem[]) || [];

  return (
    <section id="jobs" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/80 bg-background">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold flex items-center gap-2">
              <Briefcase className="size-3.5" />
              <span>Verified Corporate Requisitions</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Explore Live Engineering Openings
            </h2>
            <p className="text-sm text-muted-foreground">
              Direct recruitment opportunities from verified employers with cryptographic credential verification.
            </p>
          </div>

          <div className="text-xs font-mono text-muted-foreground">
            Total Openings: <strong className="text-foreground">{data?.totalElements ?? 0}</strong>
          </div>
        </div>

        {/* Live Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="p-3 sm:p-4 rounded-xl bg-card border border-border shadow-md space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Query */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by role title, skill, or company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11 bg-background border-border text-foreground text-xs sm:text-sm rounded-md focus-visible:ring-primary"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-3 relative">
              <MapPin className="absolute left-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-background border border-border text-foreground text-xs rounded-md focus:outline-none focus:border-primary"
              >
                <option value="all">All Locations</option>
                <option value="Bangalore">Bangalore</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Remote">Remote</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
              </select>
            </div>

            {/* Workplace Type */}
            <div className="sm:col-span-2">
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full h-11 px-3 bg-background border border-border text-foreground text-xs rounded-md focus:outline-none focus:border-primary"
              >
                <option value="ALL">Any Workplace</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm shadow-primary/20"
              >
                <SlidersHorizontal className="size-3.5 mr-1.5" />
                <span>Search</span>
              </Button>
            </div>
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-muted-foreground font-mono text-[11px] flex items-center gap-1">
              <Sparkles className="size-3 text-primary" />
              Popular:
            </span>
            {["Kubernetes", "Distributed Systems", "Java 21", "Cloud Infrastructure"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTag(tag)}
                className="px-2.5 py-1 rounded bg-secondary/80 border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center rounded-xl border border-border bg-card/40 space-y-3">
              <Loader2 className="size-6 animate-spin text-primary mx-auto" />
              <div className="text-sm font-medium text-foreground">Loading authentic requisitions...</div>
            </div>
          ) : isError ? (
            <div className="p-8 text-center rounded-xl border border-destructive/40 bg-destructive/10 space-y-2">
              <div className="text-sm font-semibold text-destructive">Failed to fetch job requisitions</div>
              <p className="text-xs text-muted-foreground">Please check backend connectivity or try again.</p>
              <Button size="sm" variant="outline" onClick={() => refetch()} className="h-8 text-xs mt-2">
                Retry Query
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-border bg-card/40 space-y-3">
              <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
                <Briefcase className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No matching requisitions found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try broadening your search keyword or clearing location filters to view active openings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useJobsQuery } from "../hooks/use-jobs";
import { JobCard } from "./job-card";
import { JobItem, SearchJobsParams } from "../types/job";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Loader2,
  Briefcase,
  Sparkles,
  ArrowUpDown,
  DollarSign,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";

const POPULAR_TAGS = ["Kubernetes", "Next.js", "Java 21", "Cloud Infrastructure", "Full Stack", "Distributed Systems"];

const SALARY_OPTIONS = [
  { label: "Any Compensation", value: 0 },
  { label: "$50,000+ / yr", value: 50000 },
  { label: "$80,000+ / yr", value: 80000 },
  { label: "$100,000+ / yr", value: 100000 },
  { label: "$120,000+ / yr", value: 120000 },
  { label: "$150,000+ / yr", value: 150000 },
  { label: "$200,000+ / yr", value: 200000 },
];

const EXPERIENCE_LEVELS = [
  { label: "All Levels", value: "ALL" },
  { label: "Entry Level", value: "ENTRY_LEVEL" },
  { label: "Mid-Level", value: "MID_LEVEL" },
  { label: "Senior", value: "SENIOR" },
  { label: "Lead / Principal", value: "LEAD" },
  { label: "Executive", value: "EXECUTIVE" },
];

const SORT_OPTIONS = [
  { label: "Newest Openings", value: "NEWEST" },
  { label: "Highest Salary", value: "SALARY_DESC" },
  { label: "Lowest Salary", value: "SALARY_ASC" },
  { label: "Most Popular", value: "POPULAR" },
];

export function PublicJobsBoard() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [workplaceType, setWorkplaceType] = useState("ALL");
  const [jobType, setJobType] = useState("ALL");
  const [experienceLevel, setExperienceLevel] = useState("ALL");
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(0);

  // Active query parameters sent to API
  const [activeParams, setActiveParams] = useState<SearchJobsParams>({
    query: "",
    location: "all",
    workplaceType: "ALL",
    jobType: "ALL",
    experienceLevel: "ALL",
    minSalary: 0,
    sortBy: "NEWEST",
    page: 0,
    size: 10,
  });

  const { data, isLoading, isError, refetch } = useJobsQuery(activeParams);

  const jobs: JobItem[] = (data?.content as JobItem[]) || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;
  const pageSize = data?.pageSize || 10;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setActiveParams({
      query: query.trim(),
      location,
      workplaceType,
      jobType,
      experienceLevel,
      minSalary: minSalary > 0 ? minSalary : undefined,
      sortBy,
      page: 0,
      size: 10,
    });
  };

  const handleQuickTag = (tag: string) => {
    setQuery(tag);
    setCurrentPage(0);
    setActiveParams((prev) => ({
      ...prev,
      query: tag,
      page: 0,
    }));
  };

  const handleResetFilters = () => {
    setQuery("");
    setLocation("all");
    setWorkplaceType("ALL");
    setJobType("ALL");
    setExperienceLevel("ALL");
    setMinSalary(0);
    setSortBy("NEWEST");
    setCurrentPage(0);
    setActiveParams({
      query: "",
      location: "all",
      workplaceType: "ALL",
      jobType: "ALL",
      experienceLevel: "ALL",
      minSalary: 0,
      sortBy: "NEWEST",
      page: 0,
      size: 10,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setCurrentPage(newPage);
    setActiveParams((prev) => ({ ...prev, page: newPage }));
    const element = document.getElementById("jobs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasActiveFilters =
    Boolean(activeParams.query) ||
    activeParams.location !== "all" ||
    activeParams.workplaceType !== "ALL" ||
    activeParams.jobType !== "ALL" ||
    activeParams.experienceLevel !== "ALL" ||
    (activeParams.minSalary && activeParams.minSalary > 0) ||
    activeParams.sortBy !== "NEWEST";

  const startRecord = totalElements > 0 ? currentPage * pageSize + 1 : 0;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

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
            Total Openings: <strong className="text-foreground">{totalElements}</strong>
          </div>
        </div>

        {/* Live Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-md space-y-4"
        >
          {/* Main Search Row */}
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
                <option value="Bangalore">Bangalore, India</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Remote">Remote</option>
                <option value="New York">New York, NY</option>
                <option value="London">London, UK</option>
                <option value="Berlin">Berlin, Germany</option>
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
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm shadow-primary/20 gap-1.5"
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Search Jobs</span>
              </Button>
            </div>
          </div>

          {/* Secondary Filter Row: Experience Level, Salary & Sorting */}
          <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Experience Level */}
            <div className="sm:col-span-4 relative flex items-center">
              <GraduationCap className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={experienceLevel}
                onChange={(e) => {
                  setExperienceLevel(e.target.value);
                  setCurrentPage(0);
                  setActiveParams((prev) => ({
                    ...prev,
                    experienceLevel: e.target.value,
                    page: 0,
                  }));
                }}
                className="w-full h-9 pl-9 pr-4 bg-secondary/40 border border-border text-foreground text-xs rounded-md font-mono focus:outline-none focus:border-primary"
              >
                {EXPERIENCE_LEVELS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Salary Range */}
            <div className="sm:col-span-4 relative flex items-center">
              <DollarSign className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={minSalary}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMinSalary(val);
                  setCurrentPage(0);
                  setActiveParams((prev) => ({
                    ...prev,
                    minSalary: val > 0 ? val : undefined,
                    page: 0,
                  }));
                }}
                className="w-full h-9 pl-9 pr-4 bg-secondary/40 border border-border text-foreground text-xs rounded-md font-mono focus:outline-none focus:border-primary"
              >
                {SALARY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting Order */}
            <div className="sm:col-span-4 relative flex items-center">
              <ArrowUpDown className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                  setActiveParams((prev) => ({
                    ...prev,
                    sortBy: e.target.value,
                    page: 0,
                  }));
                }}
                className="w-full h-9 pl-9 pr-4 bg-secondary/40 border border-border text-foreground text-xs rounded-md font-mono focus:outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Tag Chips & Active Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground font-mono text-[11px] flex items-center gap-1 mr-1">
                <Sparkles className="size-3 text-primary" />
                Popular:
              </span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTag(tag)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer border ${
                    activeParams.query === tag
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground gap-1 p-1 px-2"
              >
                <RotateCcw className="size-3" />
                <span>Reset Filters</span>
              </Button>
            )}
          </div>
        </form>

        {/* Requisitions Catalog Results Bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-mono">
          <span>
            Showing <strong className="text-foreground">{startRecord}–{endRecord}</strong> of{" "}
            <strong className="text-foreground">{totalElements}</strong> positions
          </span>
          {totalPages > 1 && (
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-16 text-center rounded-xl border border-border bg-card/40 space-y-3">
              <Loader2 className="size-6 animate-spin text-primary mx-auto" />
              <div className="text-sm font-medium text-foreground">Querying verified job database...</div>
              <p className="text-xs text-muted-foreground font-mono">Scanning live requisition indexes</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center rounded-xl border border-destructive/40 bg-destructive/10 space-y-2">
              <div className="text-sm font-semibold text-destructive">Failed to fetch job requisitions</div>
              <p className="text-xs text-muted-foreground">Please check backend connectivity or try again.</p>
              <Button size="sm" variant="outline" onClick={() => refetch()} className="h-8 text-xs mt-2 font-mono">
                Retry Query
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-16 text-center rounded-xl border border-dashed border-border bg-card/40 space-y-4">
              <div className="size-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
                <Briefcase className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">No matching positions found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  We could not find any openings matching your exact search filters. Try broadening your keywords or resetting filters.
                </p>
              </div>
              <div>
                <Button size="sm" variant="outline" onClick={handleResetFilters} className="text-xs font-mono gap-1.5 border-border">
                  <RotateCcw className="size-3.5" />
                  <span>Reset All Filters</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="h-8 text-xs font-mono border-border gap-1"
              >
                <ChevronLeft className="size-3.5" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  // Only show current, first, last, and immediate neighbors if many pages
                  const isFirst = idx === 0;
                  const isLast = idx === totalPages - 1;
                  const isCurrent = idx === currentPage;
                  const isNeighbor = Math.abs(idx - currentPage) <= 1;

                  if (!isFirst && !isLast && !isCurrent && !isNeighbor) {
                    if (idx === currentPage - 2 || idx === currentPage + 2) {
                      return (
                        <span key={idx} className="px-1 text-xs text-muted-foreground font-mono">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={idx}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(idx)}
                      className={`h-8 w-8 p-0 text-xs font-mono ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1 || isLoading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="h-8 text-xs font-mono border-border gap-1"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

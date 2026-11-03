"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight } from "lucide-react";

const POPULAR_SEARCHES = [
  { label: "Remote", query: "remote" },
  { label: "Full Stack", query: "Full Stack" },
  { label: "Backend", query: "Backend" },
  { label: "Frontend", query: "Frontend" },
  { label: "DevOps", query: "DevOps" },
  { label: "Product Manager", query: "Product Manager" },
  { label: "AI Engineer", query: "AI Engineer" },
];

export function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("ALL");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("query", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    if (experience !== "ALL") params.set("experienceLevel", experience);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tagQuery: string) => {
    router.push(`/jobs?query=${encodeURIComponent(tagQuery)}`);
  };

  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-background">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        {/* Top Status Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/80 border border-border text-xs text-foreground font-medium">
            <span>Over 1,200 verified roles posted this week</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
            Find your next role with clear pay and direct hiring.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Browse thousands of openings at verified companies. Every role includes transparent salary ranges, direct recruiter connections, and simple one-click applications.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-4xl mx-auto space-y-4">
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 rounded-xl bg-card border border-border shadow-sm space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2"
          >
            {/* Input: Keyword */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Job title, skill, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-11 pl-10 bg-background border-border text-sm placeholder:text-muted-foreground focus-visible:ring-primary rounded-lg"
              />
            </div>

            {/* Input: Location */}
            <div className="relative sm:w-56">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Location or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 pl-10 bg-background border-border text-sm placeholder:text-muted-foreground focus-visible:ring-primary rounded-lg"
              />
            </div>

            {/* Select: Experience */}
            <div className="sm:w-40">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="h-11 w-full px-3 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Levels</option>
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="MID_LEVEL">Mid-Level</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead / Staff</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-lg gap-2 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-muted-foreground">Popular:</span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleTagClick(tag.query)}
                className="px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Stat Strip */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">15,000+</div>
            <div className="text-xs text-muted-foreground mt-0.5">Active verified jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">100%</div>
            <div className="text-xs text-muted-foreground mt-0.5">Disclosed salary ranges</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">&lt; 48 Hours</div>
            <div className="text-xs text-muted-foreground mt-0.5">Average recruiter response</div>
          </div>
        </div>
      </div>
    </section>
  );
}

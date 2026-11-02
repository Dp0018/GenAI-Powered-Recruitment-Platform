"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

const TRENDING_TAGS = [
  { label: "Remote Only", query: "remote" },
  { label: "AI / ML Engineer", query: "AI Engineer" },
  { label: "Full Stack", query: "Full Stack" },
  { label: "Backend Go/Java", query: "Backend" },
  { label: "Product Manager", query: "Product Manager" },
  { label: "Frontend React/Next.js", query: "Frontend" },
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

  const handleQuickTagClick = (tagQuery: string) => {
    router.push(`/jobs?query=${encodeURIComponent(tagQuery)}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-radial-[at_top] from-primary/10 via-background to-background">
      {/* Background Decorative Mesh Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="container relative mx-auto max-w-6xl space-y-10">
        {/* Top Trust Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-mono text-muted-foreground shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-foreground font-semibold">Over 1,200 new positions added this week</span>
            <span className="text-border">|</span>
            <span className="text-primary font-medium flex items-center gap-1">
              <Zap className="size-3" />
              100% Upfront Salaries
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Where Great Careers Happen.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600">
              Direct & Without the Noise.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Skip the recruiter spam and endless ghost postings. Connect directly with hiring managers at verified companies offering transparent pay, clear requirements, and fast replies.
          </p>
        </div>

        {/* Unified Search Box Card */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 rounded-2xl bg-card border border-border shadow-xl shadow-primary/5 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3"
          >
            {/* Input 1: Role / Keyword */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-primary" />
              <Input
                type="text"
                placeholder="Job title, skill, or company (e.g. React, Stripe, Python)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-12 pl-10 bg-secondary/30 border-border text-sm placeholder:text-muted-foreground focus-visible:ring-primary rounded-xl"
              />
            </div>

            {/* Input 2: Location */}
            <div className="relative sm:w-60">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-primary" />
              <Input
                type="text"
                placeholder="Location or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 pl-10 bg-secondary/30 border-border text-sm placeholder:text-muted-foreground focus-visible:ring-primary rounded-xl"
              />
            </div>

            {/* Input 3: Experience */}
            <div className="sm:w-44">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="h-12 w-full px-3 rounded-xl bg-secondary/30 border border-border text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer font-sans"
              >
                <option value="ALL">All Experience</option>
                <option value="ENTRY_LEVEL">Entry Level (0-2y)</option>
                <option value="MID_LEVEL">Mid-Level (3-5y)</option>
                <option value="SENIOR">Senior (5-8y)</option>
                <option value="LEAD">Lead / Staff (8y+)</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-xl gap-2 shadow-md shadow-primary/25 shrink-0"
            >
              <span>Search Jobs</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Quick Trending Tags */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3 text-primary" />
              <span>Trending:</span>
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleQuickTagClick(tag.query)}
                className="px-2.5 py-1 rounded-full bg-secondary/60 hover:bg-secondary border border-border text-xs font-medium text-secondary-foreground transition-colors cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive Preview Bento Banner */}
        <div className="max-w-4xl mx-auto pt-4">
          <div className="p-6 rounded-2xl bg-card/80 border border-border shadow-lg backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">100% Verified</div>
                <div className="text-xs text-muted-foreground">Every company is manually vetted</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 border-t md:border-t-0 md:border-l border-border/80 pt-4 md:pt-0 md:pl-6">
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <DollarSign className="size-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">$145k - $280k</div>
                <div className="text-xs text-muted-foreground">Average reported salary band</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 border-t md:border-t-0 md:border-l border-border/80 pt-4 md:pt-0 md:pl-6">
              <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Zap className="size-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">&lt; 48 Hours</div>
                <div className="text-xs text-muted-foreground">Average recruiter first reply</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

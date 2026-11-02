"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  Calendar,
  Send,
  Zap,
  Shield,
  Layers,
} from "lucide-react";

export function DualPathwaySection() {
  const [activeAudience, setActiveAudience] = useState<"candidate" | "employer">("candidate");

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-secondary/15">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Toggle Switcher */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border shadow-xs">
            <button
              onClick={() => setActiveAudience("candidate")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeAudience === "candidate"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-4" />
              <span>For Job Seekers</span>
            </button>
            <button
              onClick={() => setActiveAudience("employer")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeAudience === "employer"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="size-4" />
              <span>For Employers</span>
            </button>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {activeAudience === "candidate"
                ? "Your Fast Track to Your Dream Role"
                : "Hire the Top 1% Talent in Days, Not Months"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {activeAudience === "candidate"
                ? "Build a verified profile once, apply with 1 click, and interview directly with decision makers."
                : "Post positions with AI assistance, filter pre-vetted applicants, and extend digital job offers."}
            </p>
          </div>
        </div>

        {/* 3-Step Interactive Process Cards */}
        {activeAudience === "candidate" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-7 rounded-2xl bg-card border border-border shadow-xs space-y-4 relative overflow-hidden">
              <div className="text-4xl font-black font-mono text-primary/15 absolute right-4 top-4">
                01
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                <FileText className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Build Profile or Upload Resume
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Upload your resume once. Our smart parser auto-fills your work experience, education, and 40+ technical skills in seconds.
              </p>
              <ul className="text-xs text-foreground/80 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Auto-extract skills & experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Maintain multiple targeted resume versions</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-2xl bg-card border border-border shadow-xs space-y-4 relative overflow-hidden">
              <div className="text-4xl font-black font-mono text-primary/15 absolute right-4 top-4">
                02
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Get AI Fit Scores & 1-Click Apply
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                See your match percentage on any job before applying. Submit with 1 click without leaving the page or filling tedious repetitive forms.
              </p>
              <ul className="text-xs text-foreground/80 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Instant skill match & gap analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Real-time application status tracking</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-2xl bg-card border border-border shadow-xs space-y-4 relative overflow-hidden">
              <div className="text-4xl font-black font-mono text-primary/15 absolute right-4 top-4">
                03
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                <Calendar className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Interview & Sign Digital Offer
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Self-schedule interview rounds from the hiring manager's calendar and review verified salary offers with 1-click electronic acceptance.
              </p>
              <ul className="text-xs text-foreground/80 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Direct calendar integration (ICS sync)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Legally compliant digital offer signing</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employer Step 1 */}
            <div className="p-7 rounded-2xl bg-card border border-border shadow-xs space-y-4 relative overflow-hidden">
              <div className="text-4xl font-black font-mono text-primary/15 absolute right-4 top-4">
                01
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Post Roles with AI in 60 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Generate structured, competitive job descriptions with our built-in AI copilot. Add screening questions to filter candidates automatically.
              </p>
              <ul className="text-xs text-foreground/80 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>AI job description generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Configurable custom screening questionnaires</span>
                </li>
              </ul>
            </div>

            {/* Employer Step 2 */}
            <div className="p-7 rounded-2xl bg-card border border-border shadow-xs space-y-4 relative overflow-hidden">
              <div className="text-4xl font-black font-mono text-primary/15 absolute right-4 top-4">
                02
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                AI Applicant Evaluation & Scorecards
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Review candidate applications with automated match scoring and AI-generated interview question suggestions tailored to each profile.
              </p>
              <ul className="text-xs text-foreground/80 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Automated fit breakdown & skill match</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Resume security & prompt injection scanner</span>
                </li>
              </ul>
            </div>

            {/* Employer Step 3 */}
            <div className="p-7 rounded-2xl bg-card border border-border shadow-xs space-y-4 relative overflow-hidden">
              <div className="text-4xl font-black font-mono text-primary/15 absolute right-4 top-4">
                03
              </div>
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                <Send className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Dispatch Digital Offers & Hire
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Generate formal offer letters with base salary, equity, and bonus bands. Candidates sign online with real-time audit notifications.
              </p>
              <ul className="text-xs text-foreground/80 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Full digital offer lifecycle</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Multi-recruiter team collaboration</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center pt-2">
          {activeAudience === "candidate" ? (
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 font-semibold rounded-xl gap-2 shadow-md shadow-primary/20">
                <span>Create Your Candidate Profile</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/register/employer">
              <Button size="lg" className="h-12 px-8 font-semibold rounded-xl gap-2 shadow-md shadow-primary/20">
                <span>Start Hiring Today</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  Check,
  ArrowRight,
  FileText,
  Calendar,
  Send,
  CheckCircle,
} from "lucide-react";

export function DualPathwaySection() {
  const [activeAudience, setActiveAudience] = useState<"candidate" | "employer">("candidate");

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-secondary/15">
      <div className="container mx-auto max-w-5xl space-y-12">
        {/* Toggle Switcher */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card border border-border">
            <button
              onClick={() => setActiveAudience("candidate")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeAudience === "candidate"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-4" />
              <span>For Job Seekers</span>
            </button>
            <button
              onClick={() => setActiveAudience("employer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeAudience === "employer"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="size-4" />
              <span>For Employers</span>
            </button>
          </div>

          <div className="max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {activeAudience === "candidate"
                ? "How it works for job seekers"
                : "How it works for hiring teams"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeAudience === "candidate"
                ? "Three simple steps to interview at verified companies."
                : "Find, evaluate, and hire qualified candidates faster."}
            </p>
          </div>
        </div>

        {/* 3 Steps */}
        {activeAudience === "candidate" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <div className="size-8 rounded-md bg-secondary text-foreground flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Build your profile
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Add your experience, skills, and upload your resume. Our parser auto-extracts your credentials in seconds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <div className="size-8 rounded-md bg-secondary text-foreground flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Apply in one click
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Browse verified openings with upfront salaries and apply directly using your saved profile.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <div className="size-8 rounded-md bg-secondary text-foreground flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Interview and accept offers
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Schedule interviews directly on the platform and sign formal digital offer letters without email delays.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <div className="size-8 rounded-md bg-secondary text-foreground flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Post your opening
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Create structured job listings with compensation details and optional screening questions to filter applicants.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <div className="size-8 rounded-md bg-secondary text-foreground flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Review qualified applicants
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Review verified profiles and resume documents in a streamlined recruiter dashboard with team notes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <div className="size-8 rounded-md bg-secondary text-foreground flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Send offers and hire
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Schedule interviews directly and extend formal job offers with secure electronic signature tracking.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-2">
          {activeAudience === "candidate" ? (
            <Link href="/register">
              <Button size="default" className="h-10 px-6 font-medium text-xs rounded-lg gap-2">
                <span>Create candidate account</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          ) : (
            <Link href="/register/employer">
              <Button size="default" className="h-10 px-6 font-medium text-xs rounded-lg gap-2">
                <span>Create employer account</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

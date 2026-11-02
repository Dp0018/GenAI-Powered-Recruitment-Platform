"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Heart, Sparkles, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/60 text-muted-foreground text-sm">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <Briefcase className="size-4" />
              </div>
              <span className="font-extrabold text-lg text-foreground tracking-tight">JobPortal</span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
              The modern hiring platform built for transparency and speed. Connecting exceptional software engineers, product leaders, and designers directly with verified companies.
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Links Column 1: Candidates */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              For Job Seekers
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-foreground transition-colors">
                  Explore All Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?workplaceType=REMOTE" className="hover:text-foreground transition-colors">
                  Remote Openings
                </Link>
              </li>
              <li>
                <Link href="/jobs?sortBy=SALARY_DESC" className="hover:text-foreground transition-colors">
                  High-Salary Roles
                </Link>
              </li>
              <li>
                <Link href="/dashboard/candidate" className="hover:text-foreground transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Employers */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              For Employers
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register/employer" className="hover:text-foreground transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employer" className="hover:text-foreground transition-colors">
                  Recruiter Workspace
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Employer Sign In
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Verification Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Trust & Legal */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Trust & Legal
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/80 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-primary" />
                  <span>Fraud-Free Guarantee</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} JobPortal Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Built with precision for modern engineering and hiring teams.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

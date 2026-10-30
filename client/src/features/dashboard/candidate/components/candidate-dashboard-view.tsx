"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  FileText,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
} from "lucide-react";

export function CandidateHeader() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-[11px] font-mono text-secondary-foreground mb-1.5">
          <User className="size-3 text-primary" />
          <span>Candidate Workspace</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.name || "Candidate"}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your employment applications, profile credentials, and verification status.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {user?.emailVerified ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="size-3.5" />
            <span>Email Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-400 text-xs font-medium">
            <ShieldAlert className="size-3.5" />
            <span>Unverified Email</span>
          </div>
        )}

        <Link href="/">
          <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs font-medium gap-1.5 shadow-sm shadow-primary/20">
            <Search className="size-3.5" />
            <span>Browse Jobs</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function CandidateMetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Submitted Applications</span>
          <FileText className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">0</div>
        <p className="text-[11px] text-muted-foreground">Active positions applied for</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Review In Progress</span>
          <Clock className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">0</div>
        <p className="text-[11px] text-muted-foreground">Applications currently under recruiter review</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Interviews Scheduled</span>
          <Briefcase className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">0</div>
        <p className="text-[11px] text-muted-foreground">Direct interview invitations received</p>
      </div>
    </div>
  );
}

export function CandidateApplicationsEmpty() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Recent Applications
        </h2>
        <span className="text-xs text-muted-foreground font-mono">0 Total</span>
      </div>

      <div className="rounded-lg border border-border bg-card/40 p-12 text-center space-y-3">
        <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <FileText className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">No applications submitted yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Explore open positions posted by verified employer partners and submit your resume directly.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 border-border text-foreground hover:bg-secondary rounded-md text-xs gap-1.5">
              <Search className="size-3.5" />
              <span>Search Open Positions</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CandidateProfileSummary() {
  const { user } = useAuth();

  return (
    <div className="p-6 rounded-lg border border-border bg-card/60 space-y-4">
      <h3 className="text-sm font-semibold text-foreground tracking-tight">
        Account Profile Credentials
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-muted-foreground block mb-1">Registered Full Name</span>
          <span className="text-foreground font-medium">{user?.name || "Candidate"}</span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">Primary Email Address</span>
          <span className="text-foreground font-mono">{user?.email || "candidate@example.com"}</span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">Platform Role</span>
          <span className="font-mono text-primary font-medium">{user?.role || "CANDIDATE"}</span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">Account Security</span>
          <span className="text-foreground">Password protected with Resend OTP multi-factor</span>
        </div>
      </div>
    </div>
  );
}

export function CandidateDashboardView() {
  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      <CandidateHeader />
      <CandidateMetricsGrid />
      <CandidateApplicationsEmpty />
      <CandidateProfileSummary />
    </div>
  );
}

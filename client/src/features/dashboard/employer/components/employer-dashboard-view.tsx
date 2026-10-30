"use client";

import React from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Briefcase,
  Users,
  ShieldAlert,
  Plus,
  UserPlus,
  FileSpreadsheet,
} from "lucide-react";

export function EmployerHeader() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-[11px] font-mono text-secondary-foreground mb-1.5">
          <Building2 className="size-3 text-primary" />
          <span>Employer Management Portal</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {user?.name || "Employer"} Workspace
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your company requisitions, incoming candidate submissions, and recruiter invitations.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-border text-foreground hover:bg-secondary rounded-md text-xs gap-1.5"
          onClick={() => alert("Recruiter team invites will be enabled in the upcoming company team milestone.")}
        >
          <UserPlus className="size-3.5" />
          <span>Invite Recruiter</span>
        </Button>

        <Button
          size="sm"
          className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs font-medium gap-1.5 shadow-sm shadow-primary/20"
          onClick={() => alert("Job posting creation will be enabled in the Job Requisitions milestone.")}
        >
          <Plus className="size-3.5" />
          <span>Create Job Requisition</span>
        </Button>
      </div>
    </div>
  );
}

export function EmployerKycBanner() {
  const { user } = useAuth();

  return (
    <div className="p-4 rounded-lg bg-card/70 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start sm:items-center gap-2.5">
        <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-muted-foreground">
          <span className="font-semibold text-foreground">Company Status: Pending Verification. </span>
          Platform administrators review submitted corporate credentials to prevent fraudulent postings. Requisition drafts are enabled immediately.
        </div>
      </div>
      <span className="px-2 py-0.5 rounded bg-secondary font-mono text-[10px] text-muted-foreground border border-border whitespace-nowrap self-start sm:self-auto">
        TENANT: {user?.company?.name || user?.company?.id || "REGISTERED"}
      </span>
    </div>
  );
}

export function EmployerMetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Published Requisitions</span>
          <Briefcase className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">0</div>
        <p className="text-[11px] text-muted-foreground">Active public job listings</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Candidate Applicants</span>
          <Users className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">0</div>
        <p className="text-[11px] text-muted-foreground">Total resumes received across roles</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Team Members</span>
          <Users className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">1</div>
        <p className="text-[11px] text-muted-foreground">1 Employer Admin active</p>
      </div>
    </div>
  );
}

export function EmployerRequisitionsEmpty() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Job Requisitions
        </h2>
        <span className="text-xs text-muted-foreground font-mono">0 Total</span>
      </div>

      <div className="rounded-lg border border-border bg-card/40 p-12 text-center space-y-3">
        <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <FileSpreadsheet className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">No requisitions created yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Draft your first position to specify compensation, tech stack requirements, and candidate qualifications.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border text-foreground hover:bg-secondary rounded-md text-xs gap-1.5"
            onClick={() => alert("Job posting creation will be enabled in the upcoming Job Requisitions milestone.")}
          >
            <Plus className="size-3.5" />
            <span>Create Draft Requisition</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EmployerDashboardView() {
  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      <EmployerHeader />
      <EmployerKycBanner />
      <EmployerMetricsGrid />
      <EmployerRequisitionsEmpty />
    </div>
  );
}

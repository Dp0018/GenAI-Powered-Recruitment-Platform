"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useMyApplicationsQuery } from "@/features/applications/hooks/use-applications";
import { ApplicationItem, ApplicationStatus } from "@/features/applications/types/application";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateProfileView } from "@/features/profile/components/candidate-profile-view";
import { CandidateSavedJobsTab } from "./candidate-saved-jobs-tab";
import { useSavedJobsQuery } from "@/features/jobs/hooks/use-jobs";
import {
  User,
  Briefcase,
  FileText,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Calendar,
  Bookmark,
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>Email Verified</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/40 text-[11px] font-mono text-amber-400">
            <ShieldAlert className="size-3.5" />
            <span>Verification Pending</span>
          </div>
        )}

        <Link href="/jobs">
          <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs font-medium gap-1.5 shadow-sm shadow-primary/20">
            <Search className="size-3.5" />
            <span>Explore Jobs</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface CandidateMetricsGridProps {
  applications: ApplicationItem[];
}

export function CandidateMetricsGrid({ applications }: CandidateMetricsGridProps) {
  const totalSubmitted = applications.length;
  const inReview = applications.filter(
    (a) => a.status === "REVIEWING" || a.status === "SHORTLISTED" || a.status === "APPLIED"
  ).length;
  const interviewsAndOffers = applications.filter(
    (a) => a.status === "INTERVIEWING" || a.status === "OFFERED"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Submitted Applications</span>
          <FileText className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">{totalSubmitted}</div>
        <p className="text-[11px] text-muted-foreground">Active positions applied for</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>In Active Review</span>
          <Clock className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">{inReview}</div>
        <p className="text-[11px] text-muted-foreground">Applications being evaluated by recruiters</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Interviews & Offers</span>
          <Briefcase className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">{interviewsAndOffers}</div>
        <p className="text-[11px] text-muted-foreground">Advancing candidates</p>
      </div>
    </div>
  );
}

function getStatusBadge(status: ApplicationStatus) {
  switch (status) {
    case "APPLIED":
      return "bg-secondary text-foreground border-border";
    case "REVIEWING":
    case "SHORTLISTED":
      return "bg-amber-950/40 text-amber-400 border-amber-800/40";
    case "INTERVIEWING":
      return "bg-blue-950/40 text-blue-400 border-blue-800/40";
    case "OFFERED":
      return "bg-emerald-950/40 text-emerald-400 border-emerald-800/40";
    case "REJECTED":
      return "bg-rose-950/40 text-rose-400 border-rose-800/40";
    case "WITHDRAWN":
      return "bg-secondary text-muted-foreground border-border";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}

interface CandidateApplicationsListProps {
  applications: ApplicationItem[];
  isLoading: boolean;
  totalElements: number;
}

export function CandidateApplicationsList({
  applications,
  isLoading,
  totalElements,
}: CandidateApplicationsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Application Tracking
        </h2>
        <span className="text-xs text-muted-foreground font-mono">{totalElements} Submissions</span>
      </div>

      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading your applications...
          </div>
        </div>
      ) : applications.length === 0 ? (
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
            <Link href="/jobs">
              <Button variant="outline" size="sm" className="h-8 border-border text-foreground hover:bg-secondary rounded-md text-xs gap-1.5">
                <Search className="size-3.5" />
                <span>Search Open Positions</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Position & Organization</th>
                  <th className="py-3 px-4 font-semibold">Location & Type</th>
                  <th className="py-3 px-4 font-semibold">Submitted</th>
                  <th className="py-3 px-4 font-semibold">Resume Document</th>
                  <th className="py-3 px-4 font-semibold">Hiring Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Listing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground text-sm">{app.job?.title}</div>
                      <div className="text-xs text-primary font-mono mt-0.5">
                        {app.job?.companyName || "Verified Organization"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      <div>{app.job?.location}</div>
                      <div className="text-[10px] text-muted-foreground/80">
                        [{app.job?.workplaceType}]
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono truncate max-w-[180px]"
                      >
                        <ExternalLink className="size-3 shrink-0" />
                        <span className="truncate">View Document</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {app.job?.slug && (
                        <Link
                          href={`/jobs/${app.job.slug}`}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-mono p-1 rounded hover:bg-secondary transition-colors"
                        >
                          <span>Specs</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  const { data, isLoading } = useMyApplicationsQuery();
  const { data: savedJobsData } = useSavedJobsQuery();
  const applications = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalSaved = savedJobsData?.totalElements || 0;

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
      <CandidateHeader />

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="bg-secondary/60 border border-border p-1 h-10 rounded-lg">
          <TabsTrigger
            value="applications"
            className="text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <FileText className="size-3.5" />
            <span>Applications ({totalElements})</span>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <Bookmark className="size-3.5" />
            <span>Saved Jobs ({totalSaved})</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <User className="size-3.5" />
            <span>Profile & Master Resume</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6 outline-none">
          <CandidateMetricsGrid applications={applications} />
          <CandidateApplicationsList
            applications={applications}
            isLoading={isLoading}
            totalElements={totalElements}
          />
          <CandidateProfileSummary />
        </TabsContent>

        <TabsContent value="saved" className="outline-none">
          <CandidateSavedJobsTab />
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <CandidateProfileView />
        </TabsContent>
      </Tabs>
    </div>
  );
}


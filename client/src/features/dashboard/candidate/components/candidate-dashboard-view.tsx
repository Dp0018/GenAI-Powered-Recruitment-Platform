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
import { CandidateInterviewsTab } from "./candidate-interviews-tab";
import { CandidateDraftsTab } from "./candidate-drafts-tab";
import { useSavedJobsQuery } from "@/features/jobs/hooks/use-jobs";
import { useCandidateInterviewsQuery } from "@/features/interviews/hooks/use-interviews";
import {
  User,
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
  ArrowRight,
  Bell,
  FileEdit,
  Award,
} from "lucide-react";
import { CandidateJobAlertsTab } from "./candidate-job-alerts-tab";
import { CandidateOffersTab } from "@/features/offers/components/candidate-offers-tab";
import { useCandidateOffersQuery } from "@/features/offers/hooks/use-offers";
import { ApplicationDetailDrawer } from "@/features/applications/components/application-detail-drawer";

export function CandidateHeader() {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "C";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-card via-card/90 to-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xs space-y-6">
      {/* Subtle ambient accent glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="size-14 sm:size-16 rounded-2xl bg-linear-to-br from-sky-500/20 via-card to-indigo-500/20 border border-sky-500/30 text-sky-400 font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-inner">
            {initial}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Candidate Workspace
              </span>
              <span className="text-border">•</span>
              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="size-3 text-emerald-400" />
                  <span>Verified Profile</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-medium text-amber-400">
                  <ShieldAlert className="size-3 text-amber-400" />
                  <span>Verification Pending</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {user?.name || "Candidate"}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Track your active job applications, interview schedules, offers, and verified credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/jobs">
            <Button className="h-11 px-5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 gap-2 transition-all cursor-pointer">
              <Search className="size-3.5" />
              <span>Browse Openings</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface CandidateMetricsGridProps {
  applications: ApplicationItem[];
  totalOffers: number;
  totalInterviews: number;
}

export function CandidateMetricsGrid({
  applications,
  totalOffers,
  totalInterviews,
}: CandidateMetricsGridProps) {
  const totalSubmitted = applications.length;
  const inReview = applications.filter(
    (a) => a.status === "REVIEWING" || a.status === "SHORTLISTED" || a.status === "APPLIED"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Submitted Applications */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/80 space-y-2.5 hover:border-sky-500/30 transition-colors shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
          <span>Submitted Applications</span>
          <div className="size-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <FileText className="size-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {totalSubmitted}
        </div>
        <p className="text-[11px] text-muted-foreground">Active positions applied for</p>
      </div>

      {/* 2. In Review */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/80 space-y-2.5 hover:border-amber-500/30 transition-colors shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
          <span>In Active Review</span>
          <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {inReview}
        </div>
        <p className="text-[11px] text-muted-foreground">Applications being evaluated</p>
      </div>

      {/* 3. Interviews Scheduled */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/80 space-y-2.5 hover:border-indigo-500/30 transition-colors shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
          <span>Interview Rounds</span>
          <div className="size-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Calendar className="size-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {totalInterviews}
        </div>
        <p className="text-[11px] text-muted-foreground">Scheduled & upcoming sessions</p>
      </div>

      {/* 4. Offers & Contracts */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/80 space-y-2.5 hover:border-emerald-500/30 transition-colors shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
          <span>Job Offers Received</span>
          <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="size-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {totalOffers}
        </div>
        <p className="text-[11px] text-muted-foreground">Formal offers & contracts</p>
      </div>
    </div>
  );
}

function getStatusBadge(status: ApplicationStatus) {
  switch (status) {
    case "APPLIED":
      return "bg-secondary text-foreground border-border/80";
    case "REVIEWING":
    case "SHORTLISTED":
      return "bg-amber-500/10 text-amber-400 border-amber-500/25";
    case "INTERVIEWING":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
    case "OFFERED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 font-bold";
    case "REJECTED":
      return "bg-rose-500/10 text-rose-400 border-rose-500/25";
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
  const [selectedApp, setSelectedApp] = React.useState<ApplicationItem | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleOpenDrawer = (app: ApplicationItem) => {
    setSelectedApp(app);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Application Tracking
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time status updates from corporate hiring teams
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {totalElements} Submissions
        </span>
      </div>

      {isLoading ? (
        <div className="p-16 text-center rounded-2xl border border-border/80 bg-card/40 space-y-3">
          <Loader2 className="size-7 animate-spin text-sky-400 mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading your applications...
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card/50 p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="size-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto text-sky-400 shadow-inner">
            <FileText className="size-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">No applications submitted yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Explore open positions posted directly by verified employer partners. Your submissions are sent straight to engineering leads.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/jobs">
              <Button className="h-10 px-6 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer">
                <Search className="size-3.5" />
                <span>Search Live Jobs</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Position & Organization</th>
                  <th className="py-3.5 px-4">Location & Type</th>
                  <th className="py-3.5 px-4">Date Applied</th>
                  <th className="py-3.5 px-4">Resume</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-4">
                      <div
                        className="font-bold text-foreground text-sm hover:text-sky-400 transition-colors cursor-pointer"
                        onClick={() => handleOpenDrawer(app)}
                      >
                        {app.job?.title}
                      </div>
                      <div className="text-xs text-sky-400 font-medium mt-0.5">
                        {app.job?.companyName || "Verified Organization"}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="font-medium text-foreground">{app.job?.location}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {app.job?.workplaceType}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground font-mono">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently"}
                    </td>
                    <td className="py-4 px-4">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"
                        >
                          <FileText className="size-3.5" />
                          <span>View PDF</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">Profile Master</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleOpenDrawer(app)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer hover:opacity-85 transition-opacity ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDrawer(app)}
                          className="h-8 px-3 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 gap-1.5 rounded-lg"
                        >
                          <span>Timeline</span>
                          <ArrowRight className="size-3.5" />
                        </Button>

                        {app.job?.slug && (
                          <Link
                            href={`/jobs/${app.job.slug}`}
                            className="inline-flex items-center justify-center size-8 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                            title="View job opening"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Application Detail & Timeline Drawer */}
      <ApplicationDetailDrawer
        application={selectedApp}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

export function CandidateProfileSummary() {
  const { user } = useAuth();

  return (
    <div className="p-6 sm:p-7 rounded-2xl border border-border/80 bg-card/60 space-y-4 shadow-xs">
      <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
        <User className="size-4 text-sky-400" />
        <span>Candidate Profile Credentials</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
            Registered Name
          </span>
          <div className="text-foreground font-semibold text-sm">{user?.name || "Candidate"}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
            Primary Email
          </span>
          <div className="text-foreground font-mono">{user?.email || "candidate@example.com"}</div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
            Platform Role
          </span>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {user?.role || "CANDIDATE"}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
            Account Security
          </span>
          <div className="text-foreground flex items-center gap-1.5 font-medium">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span>Multi-factor authentication active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CandidateDashboardView() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data, isLoading } = useMyApplicationsQuery();
  const { data: savedJobsData } = useSavedJobsQuery();
  const { data: interviewsData } = useCandidateInterviewsQuery();
  const { data: offersData = [] } = useCandidateOffersQuery();
  const applications = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalSaved = savedJobsData?.totalElements || 0;
  const totalInterviews = (interviewsData || []).filter(
    (i) => i.status === "SCHEDULED"
  ).length;
  const pendingOffers = offersData.filter((o) => o.status === "SENT").length;

  if (isAuthLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-3">
        <Loader2 className="size-8 animate-spin text-sky-400" />
        <span className="text-xs text-muted-foreground font-mono">Verifying candidate session...</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "CANDIDATE") {
    return (
      <div className="flex-1 py-20 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="size-14 rounded-2xl bg-secondary border border-border text-sky-400 flex items-center justify-center mx-auto shadow-inner">
          <User className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Candidate Sign In Required</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Please log in with your candidate credentials to access your submitted applications, interview requests, and offers.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button className="h-10 px-6 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl">
              Sign In to Candidate Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <CandidateHeader />

      <Tabs defaultValue="applications" className="space-y-6">
        {/* Modern tactile Segmented Navigation Pill Strip */}
        <div className="overflow-x-auto no-scrollbar pb-1">
          <TabsList className="inline-flex items-center gap-1.5 p-1.5 bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl h-13 min-h-[52px] shadow-xs">
            <TabsTrigger
              value="applications"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <FileText className="size-4" />
              <span>Applications</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-secondary/80 text-muted-foreground border border-border/60">
                {totalElements}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="offers"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <Award className="size-4 text-emerald-400" />
              <span>Offers</span>
              {pendingOffers > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {pendingOffers} action
                </span>
              ) : offersData.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-secondary/80 text-muted-foreground border border-border/60">
                  {offersData.length}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="interviews"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <Calendar className="size-4" />
              <span>Interviews</span>
              {totalInterviews > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold">
                  {totalInterviews}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="saved"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <Bookmark className="size-4" />
              <span>Saved Jobs</span>
              {totalSaved > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-secondary/80 text-muted-foreground border border-border/60">
                  {totalSaved}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="drafts"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <FileEdit className="size-4" />
              <span>Drafts</span>
            </TabsTrigger>

            <TabsTrigger
              value="alerts"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <Bell className="size-4" />
              <span>Job Alerts</span>
            </TabsTrigger>

            <TabsTrigger
              value="profile"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <User className="size-4" />
              <span>Profile & Master Resume</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="applications" className="space-y-6 outline-none">
          <CandidateMetricsGrid
            applications={applications}
            totalOffers={offersData.length}
            totalInterviews={totalInterviews}
          />
          <CandidateApplicationsList
            applications={applications}
            isLoading={isLoading}
            totalElements={totalElements}
          />
          <CandidateProfileSummary />
        </TabsContent>

        <TabsContent value="offers" className="outline-none">
          <CandidateOffersTab />
        </TabsContent>

        <TabsContent value="interviews" className="outline-none">
          <CandidateInterviewsTab />
        </TabsContent>

        <TabsContent value="saved" className="outline-none">
          <CandidateSavedJobsTab />
        </TabsContent>

        <TabsContent value="drafts" className="outline-none">
          <CandidateDraftsTab />
        </TabsContent>

        <TabsContent value="alerts" className="outline-none">
          <CandidateJobAlertsTab />
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <CandidateProfileView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

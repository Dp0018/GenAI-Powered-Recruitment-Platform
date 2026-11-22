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
  Crown,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { ResumeBulletOptimizer } from "@/features/rag/components/resume-bullet-optimizer";
import { useBilling } from "@/features/billing/hooks/use-billing";
import { CandidateJobAlertsTab } from "./candidate-job-alerts-tab";
import { CandidateOffersTab } from "@/features/offers/components/candidate-offers-tab";
import { useCandidateOffersQuery } from "@/features/offers/hooks/use-offers";
import { ApplicationDetailDrawer } from "@/features/applications/components/application-detail-drawer";

export function CandidateHeader() {
  const { user } = useAuth();
  const { subscription, openCustomerPortal, isOpenPortalLoading } = useBilling();
  const isPro = subscription?.planType === "PRO" || Boolean(subscription?.isPaid);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "C";

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="size-12 rounded-lg bg-secondary border border-border text-foreground flex items-center justify-center font-semibold text-base">
              {initial}
            </div>
            {isPro && (
              <div
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs border border-card"
                title="Candidate Pro Member"
              >
                <Crown className="size-3 fill-slate-950 text-slate-950" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">
                Candidate workspace
              </span>
              <span className="text-border">•</span>
              {isPro ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <Crown className="size-3" />
                  <span>Pro member</span>
                </span>
              ) : (
                <Link href="/pricing">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-[11px] font-medium text-muted-foreground transition-colors cursor-pointer border border-border">
                    <Crown className="size-3" />
                    <span>Get Pro</span>
                  </span>
                </Link>
              )}
              <span className="text-border">•</span>
              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="size-3" />
                  <span>Unverified</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <span>{user?.name || "Candidate"}</span>
              {isPro && (
                <span title="Candidate Pro Member">
                  <Crown className="size-4 text-amber-500 fill-amber-500 inline shrink-0" />
                </span>
              )}
            </h1>

            <p className="text-xs text-muted-foreground">
              {isPro
                ? "Candidate Pro active: Spotlight badge applied and resume score forecast enabled."
                : "Active job applications, interviews, offers, and credentials."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {isPro && subscription?.customerId ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs gap-1.5 rounded-lg cursor-pointer hover:bg-secondary"
              onClick={() => openCustomerPortal()}
              disabled={isOpenPortalLoading}
            >
              <CreditCard className="size-3.5 text-muted-foreground" />
              <span>Billing</span>
            </Button>
          ) : !isPro ? (
            <Link href="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-medium gap-1.5 rounded-lg border-border hover:bg-secondary cursor-pointer"
              >
                <Crown className="size-3.5 text-amber-500" />
                <span>Upgrade to Pro</span>
              </Button>
            </Link>
          ) : null}

          <Link href="/jobs">
            <Button
              size="sm"
              className="h-9 px-3.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-lg gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="size-3.5" />
              <span>Browse jobs</span>
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
      <div className="p-4 rounded-xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Applications</span>
          <FileText className="size-3.5 text-muted-foreground" />
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
          {totalSubmitted}
        </div>
        <p className="text-[11px] text-muted-foreground">Active positions applied</p>
      </div>

      {/* 2. In Review */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>In review</span>
          <span className="size-2 rounded-full bg-amber-500" />
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
          {inReview}
        </div>
        <p className="text-[11px] text-muted-foreground">Under active review</p>
      </div>

      {/* 3. Interviews Scheduled */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Interviews</span>
          <Calendar className="size-3.5 text-muted-foreground" />
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
          {totalInterviews}
        </div>
        <p className="text-[11px] text-muted-foreground">Upcoming rounds</p>
      </div>

      {/* 4. Offers & Contracts */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Offers</span>
          <Award className="size-3.5 text-muted-foreground" />
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
          {totalOffers}
        </div>
        <p className="text-[11px] text-muted-foreground">Formal offers received</p>
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
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "INTERVIEWING":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "OFFERED":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium";
    case "REJECTED":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Application tracking
          </h2>
          <p className="text-xs text-muted-foreground">
            Status updates from corporate hiring teams
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {totalElements} submissions
        </span>
      </div>

      {isLoading ? (
        <div className="p-12 text-center rounded-xl border border-border bg-card space-y-2">
          <Loader2 className="size-5 animate-spin text-muted-foreground mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading applications...
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center space-y-3">
          <div className="size-10 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
            <FileText className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">No applications submitted yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Explore positions posted directly by verified employer partners.
            </p>
          </div>
          <div className="pt-1">
            <Link href="/jobs">
              <Button
                size="sm"
                className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs gap-1.5 cursor-pointer font-medium"
              >
                <Search className="size-3" />
                <span>Browse jobs</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground text-[11px] font-medium">
                <tr>
                  <th className="py-2.5 px-4">Position</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Applied</th>
                  <th className="py-2.5 px-4">Resume</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div
                        className="font-medium text-foreground text-xs hover:text-primary transition-colors cursor-pointer"
                        onClick={() => handleOpenDrawer(app)}
                      >
                        {app.job?.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {app.job?.companyName || "Verified Organization"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div className="text-foreground">{app.job?.location}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {app.job?.workplaceType}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently"}
                    </td>
                    <td className="py-3 px-4">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <FileText className="size-3" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">Profile</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenDrawer(app)}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border cursor-pointer hover:opacity-80 transition-opacity ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status.toLowerCase()}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDrawer(app)}
                          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 rounded-md"
                        >
                          <span>Timeline</span>
                          <ArrowRight className="size-3" />
                        </Button>

                        {app.job?.slug && (
                          <Link
                            href={`/jobs/${app.job.slug}`}
                            className="inline-flex items-center justify-center size-7 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
                            title="View job opening"
                          >
                            <ExternalLink className="size-3" />
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
    <div className="p-5 rounded-xl border border-border bg-card space-y-3">
      <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
        <User className="size-3.5 text-muted-foreground" />
        <span>Profile credentials</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="text-muted-foreground text-[11px]">
            Registered name
          </span>
          <div className="text-foreground font-medium">{user?.name || "Candidate"}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-muted-foreground text-[11px]">
            Primary email
          </span>
          <div className="text-foreground font-mono">{user?.email || "candidate@example.com"}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-muted-foreground text-[11px]">
            Role
          </span>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-secondary text-foreground border border-border">
              {user?.role || "CANDIDATE"}
            </span>
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-muted-foreground text-[11px]">
            Security
          </span>
          <div className="text-foreground flex items-center gap-1.5 font-medium">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>MFA enabled</span>
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
      <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-2">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-mono">Verifying session...</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "CANDIDATE") {
    return (
      <div className="flex-1 py-20 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="size-12 rounded-lg bg-secondary border border-border text-muted-foreground flex items-center justify-center mx-auto">
          <User className="size-6" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Sign in required</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sign in to access applications, interview schedules, and offers.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-lg">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
      <CandidateHeader />

      <Tabs defaultValue="applications" className="space-y-4">
        {/* Clean Segmented Navigation Tab Strip */}
        <div className="overflow-x-auto no-scrollbar pb-0.5">
          <TabsList className="inline-flex items-center gap-1 p-1 bg-secondary border border-border rounded-lg h-9">
            <TabsTrigger
              value="applications"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <FileText className="size-3.5" />
              <span>Applications</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-secondary/80 text-muted-foreground border border-border">
                {totalElements}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="offers"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <Award className="size-3.5" />
              <span>Offers</span>
              {pendingOffers > 0 ? (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {pendingOffers} action
                </span>
              ) : offersData.length > 0 ? (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-secondary/80 text-muted-foreground border border-border">
                  {offersData.length}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="interviews"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <Calendar className="size-3.5" />
              <span>Interviews</span>
              {totalInterviews > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                  {totalInterviews}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="saved"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <Bookmark className="size-3.5" />
              <span>Saved</span>
              {totalSaved > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-secondary/80 text-muted-foreground border border-border">
                  {totalSaved}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="drafts"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <FileEdit className="size-3.5" />
              <span>Drafts</span>
            </TabsTrigger>

            <TabsTrigger
              value="alerts"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <Bell className="size-3.5" />
              <span>Job alerts</span>
            </TabsTrigger>

            <TabsTrigger
              value="resume-optimizer"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <Zap className="size-3.5" />
              <span>Bullet Optimizer (AI)</span>
            </TabsTrigger>

            <TabsTrigger
              value="profile"
              className="h-7 px-3 rounded-md text-xs font-medium gap-1.5 transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs border-transparent select-none whitespace-nowrap cursor-pointer"
            >
              <User className="size-3.5" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="applications" className="space-y-4 outline-none">
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

        <TabsContent value="resume-optimizer" className="outline-none">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <ResumeBulletOptimizer />
          </div>
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <CandidateProfileView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

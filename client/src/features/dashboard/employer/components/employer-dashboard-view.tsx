"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  useCompanyJobsQuery,
  useDeleteJobMutation,
  useUpdateJobStatusMutation,
} from "@/features/jobs/hooks/use-jobs";
import { useCompanyApplicationsQuery } from "@/features/applications/hooks/use-applications";
import { EmployerApplicantsTable } from "@/features/applications/components/employer-applicants-table";
import { CreateJobModal } from "@/features/jobs/components/create-job-modal";
import { EditJobModal } from "@/features/jobs/components/edit-job-modal";
import { EmployerTeamTab } from "./employer-team-tab";
import { EmployerCompanyBrandingTab } from "./employer-company-branding-tab";
import { Button } from "@/components/ui/button";
import { JobItem } from "@/features/jobs/types/job";
import {
  Building2,
  Briefcase,
  Users,
  ShieldAlert,
  Plus,
  UserPlus,
  FileSpreadsheet,
  ExternalLink,
  Trash2,
  Loader2,
  CheckCircle2,
  Edit2,
  Copy,
  ToggleLeft,
  ToggleRight,
  Clock,
  AlertTriangle,
  Eye,
  TrendingUp,
} from "lucide-react";

interface EmployerHeaderProps {
  onNavigateToTeam: () => void;
}

export function EmployerHeader({ onNavigateToTeam }: EmployerHeaderProps) {
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
          Manage your company job postings, incoming candidate submissions, and
          recruiter invitations.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-border text-foreground hover:bg-secondary rounded-md text-xs gap-1.5"
          onClick={onNavigateToTeam}
        >
          <UserPlus className="size-3.5" />
          <span>Invite Recruiter</span>
        </Button>

        <CreateJobModal
          triggerButton={
            <Button
              size="sm"
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs font-medium gap-1.5 shadow-xs shadow-primary/20"
            >
              <Plus className="size-3.5" />
              <span>Post a Job</span>
            </Button>
          }
        />
      </div>
    </div>
  );
}

export function EmployerKycBanner() {
  const { user } = useAuth();
  const isVerified = user?.company?.verificationStatus === "VERIFIED";

  return (
    <div className="p-4 rounded-lg bg-card/70 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start sm:items-center gap-2.5">
        {isVerified ? (
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
        ) : (
          <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
        )}
        <div className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {isVerified
              ? "Company Status: Verified Corporate Entity. "
              : "Company Status: Pending Corporate Verification. "}
          </span>
          {isVerified
            ? "Your postings carry the verified corporate entity cryptographic badge."
            : "Platform administrators review submitted credentials to ensure genuine listings. Job creation is active."}
        </div>
      </div>
      <span className="px-2 py-0.5 rounded bg-secondary font-mono text-[10px] text-muted-foreground border border-border whitespace-nowrap self-start sm:self-auto">
        TENANT: {user?.company?.name || user?.company?.id || "REGISTERED"}
      </span>
    </div>
  );
}

interface EmployerMetricsGridProps {
  jobs: JobItem[];
  totalApplicants: number;
}

export function EmployerMetricsGrid({
  jobs,
  totalApplicants,
}: EmployerMetricsGridProps) {
  const publishedCount = jobs.filter(
    (j) => j.status === "PUBLISHED" && !j.expired,
  ).length;
  const totalViews = jobs.reduce((acc, j) => acc + (j.viewsCount || 0), 0);
  const conversionRate =
    totalViews > 0 ? ((totalApplicants / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Active Job Openings</span>
          <Briefcase className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">
          {publishedCount}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Live & accepting applications
        </p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Total Job Views</span>
          <Eye className="size-4 text-purple-400" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">
          {totalViews}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Candidate views across postings
        </p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Candidate Applicants</span>
          <Users className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">
          {totalApplicants}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Total applications received
        </p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Conversion Funnel</span>
          <TrendingUp className="size-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-emerald-400 tracking-tight">
          {conversionRate}%
        </div>
        <p className="text-[11px] text-muted-foreground">
          Applications per 100 views
        </p>
      </div>
    </div>
  );
}

interface EmployerJobsTableProps {
  jobs: JobItem[];
  isLoading: boolean;
  totalElements: number;
}

export function EmployerJobsTable({
  jobs,
  isLoading,
  totalElements,
}: EmployerJobsTableProps) {
  const deleteMutation = useDeleteJobMutation();
  const statusMutation = useUpdateJobStatusMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Duplicate Job Modal State
  const [duplicatingJob, setDuplicatingJob] = useState<JobItem | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete job "${title}"?`)) {
      setDeletingId(id);
      deleteMutation.mutate(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  const handleToggleStatus = (job: JobItem) => {
    const nextStatus = job.status === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    statusMutation.mutate({ id: job.id, status: nextStatus });
  };

  const handleEdit = (job: JobItem) => {
    setEditingJob(job);
    setEditModalOpen(true);
  };

  const handleDuplicate = (job: JobItem) => {
    setDuplicatingJob(job);
    setDuplicateModalOpen(true);
  };

function JobExpirationBadge({ job }: { job: JobItem }) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!job.expiresAt) return;
    const msLeft = new Date(job.expiresAt).getTime() - Date.now();
    const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    if (days <= 7 && days > 0) {
      setDaysLeft(days);
    }
  }, [job.expiresAt]);

  if (job.expired) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-destructive/10 text-destructive border border-destructive/20">
        <AlertTriangle className="size-3" />
        <span>Expired</span>
      </span>
    );
  }

  if (daysLeft !== null) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
        <Clock className="size-3" />
        <span>Expires in {daysLeft}d</span>
      </span>
    );
  }

  return null;
}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Job Postings
        </h2>
        <span className="text-xs text-muted-foreground font-mono">
          {totalElements} Total
        </span>
      </div>

      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading job postings...
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card/40 p-12 text-center space-y-3">
          <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
            <FileSpreadsheet className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              No jobs posted yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Post your first opening to specify compensation, workplace policy,
              and role expectations.
            </p>
          </div>
          <div className="pt-2">
            <CreateJobModal
              triggerButton={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-border text-foreground hover:bg-secondary rounded-md text-xs gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Post a Job</span>
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Position Title</th>
                  <th className="py-3 px-4 font-semibold">Type & Workplace</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Compensation</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">
                    Funnel (Views / Apps)
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {job.title}
                        </span>
                        <JobExpirationBadge job={job} />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.tags?.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      <div>{job.workplaceType}</div>
                      <div className="text-[10px] text-muted-foreground/80">
                        {job.jobType.replace("_", " ")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {job.location}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {job.minSalary && job.maxSalary
                        ? `£${(job.minSalary / 1000).toFixed(0)}k - £${(job.maxSalary / 1000).toFixed(0)}k`
                        : job.minSalary
                          ? `From £${(job.minSalary / 1000).toFixed(0)}k`
                          : "Competitive"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                            job.status === "PUBLISHED" && !job.expired
                              ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                              : job.status === "CLOSED" || job.expired
                                ? "bg-secondary text-muted-foreground border border-border"
                                : "bg-amber-950/40 text-amber-400 border border-amber-800/40"
                          }`}
                        >
                          {job.expired ? "EXPIRED" : job.status}
                        </span>

                        {/* 1-Click Status Toggle Action */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(job)}
                          disabled={statusMutation.isPending}
                          title={
                            job.status === "PUBLISHED"
                              ? "Click to close job"
                              : "Click to publish job"
                          }
                          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {job.status === "PUBLISHED" ? (
                            <ToggleRight className="size-4 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="size-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Users className="size-3 text-primary" />
                        <span>{job.applicantCount || 0} apps</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Eye className="size-3 text-muted-foreground/70" />
                        <span>{job.viewsCount || 0} views</span>
                        {job.viewsCount && job.viewsCount > 0 ? (
                          <span className="text-emerald-400 font-bold ml-1">
                            (
                            {(
                              (job.applicantCount / job.viewsCount) *
                              100
                            ).toFixed(0)}
                            %)
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Action */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(job)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Edit job details"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>

                        {/* Duplicate Action */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicate(job)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                          title="Duplicate this job"
                        >
                          <Copy className="size-3.5" />
                        </Button>

                        {/* Live Link */}
                        <Link
                          href={`/jobs/${job.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="View live listing"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>

                        {/* Delete Action */}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === job.id}
                          onClick={() => handleDelete(job.id, job.title)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete job"
                        >
                          {deletingId === job.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      <EditJobModal
        job={editingJob}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      {/* Duplicate / Clone Job Modal */}
      <CreateJobModal
        open={duplicateModalOpen}
        onOpenChange={setDuplicateModalOpen}
        initialValues={duplicatingJob}
      />
    </div>
  );
}

export function EmployerDashboardView() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "jobs" | "applicants" | "branding" | "team"
  >("jobs");
  const { data: jobsData, isLoading: jobsLoading } = useCompanyJobsQuery();
  const { data: appsData } = useCompanyApplicationsQuery();

  const jobs = jobsData?.content || [];
  const totalJobs = jobsData?.totalElements || 0;
  const totalApplicants = appsData?.totalElements || 0;

  if (isAuthLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">
          Verifying employer access...
        </span>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    (user?.role !== "EMPLOYER_ADMIN" && user?.role !== "RECRUITER")
  ) {
    return (
      <div className="flex-1 py-20 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="size-12 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          Employer Access Restricted
        </h2>
        <p className="text-xs text-muted-foreground">
          This workspace requires an authenticated corporate account (
          <span className="font-mono text-primary">EMPLOYER_ADMIN</span> or{" "}
          <span className="font-mono text-primary">RECRUITER</span>).
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-mono text-xs"
            >
              Log in to Employer Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <EmployerHeader onNavigateToTeam={() => setActiveTab("team")} />
      <EmployerKycBanner />
      <EmployerMetricsGrid jobs={jobs} totalApplicants={totalApplicants} />

      {/* Modern Segmented Navigation Pill Strip */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl h-13 min-h-[52px] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer flex items-center ${
              activeTab === "jobs"
                ? "bg-secondary text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <FileSpreadsheet className="size-4" />
            <span>Job Postings</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-secondary/80 text-muted-foreground border border-border/60">
              {totalJobs}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("applicants")}
            className={`h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer flex items-center ${
              activeTab === "applicants"
                ? "bg-secondary text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <Users className="size-4" />
            <span>Applicant Pipeline</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-secondary/80 text-muted-foreground border border-border/60">
              {totalApplicants}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("branding")}
            className={`h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer flex items-center ${
              activeTab === "branding"
                ? "bg-secondary text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <Building2 className="size-4" />
            <span>Company Branding</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={`h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer flex items-center ${
              activeTab === "team"
                ? "bg-secondary text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <Users className="size-4" />
            <span>Team & Recruiters</span>
          </button>
        </div>
      </div>

      {activeTab === "jobs" ? (
        <EmployerJobsTable
          jobs={jobs}
          isLoading={jobsLoading}
          totalElements={totalJobs}
        />
      ) : activeTab === "applicants" ? (
        <EmployerApplicantsTable />
      ) : activeTab === "branding" ? (
        <EmployerCompanyBrandingTab />
      ) : (
        <EmployerTeamTab />
      )}
    </div>
  );
}

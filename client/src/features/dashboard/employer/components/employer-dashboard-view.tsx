"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useCompanyJobsQuery, useDeleteJobMutation } from "@/features/jobs/hooks/use-jobs";
import { CreateJobModal } from "@/features/jobs/components/create-job-modal";
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
  MapPin,
  DollarSign,
  Loader2,
  CheckCircle2,
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

        <CreateJobModal
          triggerButton={
            <Button
              size="sm"
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs font-medium gap-1.5 shadow-sm shadow-primary/20"
            >
              <Plus className="size-3.5" />
              <span>Create Job Requisition</span>
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
}

export function EmployerMetricsGrid({ jobs }: EmployerMetricsGridProps) {
  const publishedCount = jobs.filter((j) => j.status === "PUBLISHED").length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Active Requisitions</span>
          <Briefcase className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">{publishedCount}</div>
        <p className="text-[11px] text-muted-foreground">Published to live candidate board</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Candidate Applicants</span>
          <Users className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">{totalApplicants}</div>
        <p className="text-[11px] text-muted-foreground">Total applications received across roles</p>
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

interface EmployerRequisitionsTableProps {
  jobs: JobItem[];
  isLoading: boolean;
  totalElements: number;
}

export function EmployerRequisitionsTable({
  jobs,
  isLoading,
  totalElements,
}: EmployerRequisitionsTableProps) {
  const deleteMutation = useDeleteJobMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete requisition "${title}"?`)) {
      setDeletingId(id);
      deleteMutation.mutate(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Job Requisitions
        </h2>
        <span className="text-xs text-muted-foreground font-mono">{totalElements} Total</span>
      </div>

      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading company requisitions...
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card/40 p-12 text-center space-y-3">
          <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
            <FileSpreadsheet className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">No requisitions created yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Draft your first position to specify compensation bands, workplace policy, and role expectations.
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
                  <span>Create Requisition</span>
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Position Title</th>
                  <th className="py-3 px-4 font-semibold">Type & Workplace</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Compensation</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Applicants</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground text-sm">{job.title}</div>
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
                    <td className="py-3.5 px-4 text-muted-foreground">{job.location}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {job.minSalary && job.maxSalary
                        ? `$${(job.minSalary / 1000).toFixed(0)}k - $${(job.maxSalary / 1000).toFixed(0)}k`
                        : job.minSalary
                        ? `From $${(job.minSalary / 1000).toFixed(0)}k`
                        : "Competitive"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          job.status === "PUBLISHED"
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {job.applicantCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/jobs/${job.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="View live listing"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === job.id}
                          onClick={() => handleDelete(job.id, job.title)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete requisition"
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
    </div>
  );
}

export function EmployerDashboardView() {
  const { data, isLoading } = useCompanyJobsQuery();
  const jobs = data?.content || [];
  const totalElements = data?.totalElements || 0;

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      <EmployerHeader />
      <EmployerKycBanner />
      <EmployerMetricsGrid jobs={jobs} />
      <EmployerRequisitionsTable
        jobs={jobs}
        isLoading={isLoading}
        totalElements={totalElements}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  useCompanyApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "../hooks/use-applications";
import { ApplicationItem, ApplicationStatus } from "../types/application";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Loader2,
  FileText,
  Mail,
  Phone,
  Calendar,
  Star,
  Download,
  Sparkles,
  XCircle,
  Award,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { ResumePreviewModal } from "./resume-preview-modal";
import { ScheduleInterviewModal } from "@/features/interviews/components/schedule-interview-modal";
import { ApplicationMatchBadge } from "./application-match-badge";
import { CreateOfferModal } from "@/features/offers/components/create-offer-modal";
import { SkillGapRejectionModal } from "./skill-gap-rejection-modal";

interface EmployerApplicantsTableProps {
  jobId?: string;
}

export function EmployerApplicantsTable({ jobId }: EmployerApplicantsTableProps) {
  const { data, isLoading } = useCompanyApplicationsQuery(jobId);
  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const [selectedNote, setSelectedNote] = useState<{
    candidateName: string;
    note: string;
  } | null>(null);
  const [previewingApp, setPreviewingApp] = useState<ApplicationItem | null>(null);
  const [schedulingApp, setSchedulingApp] = useState<ApplicationItem | null>(null);
  const [offeringApp, setOfferingApp] = useState<ApplicationItem | null>(null);
  const [rejectingApp, setRejectingApp] = useState<ApplicationItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const applications = data?.content || [];
  const totalElements = data?.totalElements || 0;

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length && applications.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (newStatus: ApplicationStatus) => {
    selectedIds.forEach((id) => {
      updateStatusMutation.mutate({
        applicationId: id,
        payload: { status: newStatus },
      });
    });
    toast.success(`Advancing ${selectedIds.length} candidate(s) to ${newStatus}`);
    setSelectedIds([]);
  };

  const exportToCsv = () => {
    const appsToExport = selectedIds.length > 0
      ? applications.filter((a) => selectedIds.includes(a.id))
      : applications;

    if (appsToExport.length === 0) {
      toast.error("No applicants to export");
      return;
    }

    const headers = ["Candidate Name", "Email", "Phone", "Job Title", "Location", "Stage", "Applied Date", "Rating"];
    const rows = appsToExport.map((a) => [
      `"${(a.candidate?.name || "").replace(/"/g, '""')}"`,
      `"${(a.candidate?.email || "").replace(/"/g, '""')}"`,
      `"${(a.phone || "").replace(/"/g, '""')}"`,
      `"${(a.job?.title || "").replace(/"/g, '""')}"`,
      `"${(a.job?.location || "").replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${new Date(a.createdAt).toLocaleDateString()}"`,
      `"${a.averageRating ? a.averageRating.toFixed(1) : "N/A"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `applicants_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${appsToExport.length} candidate(s) to CSV`);
  };

  const handleStatusChange = (
    app: ApplicationItem,
    newStatus: ApplicationStatus
  ) => {
    if (newStatus === "REJECTED") {
      setRejectingApp(app);
      return;
    }

    updateStatusMutation.mutate({
      applicationId: app.id,
      payload: { status: newStatus },
    });

    if (newStatus === "INTERVIEWING") {
      setSchedulingApp(app);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Applicant Pipeline
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {totalElements} Candidate{totalElements !== 1 ? "s" : ""}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={exportToCsv}
          className="h-8 text-xs font-mono gap-1.5 border-border cursor-pointer"
          title="Export applicant roster to CSV"
        >
          <Download className="size-3.5" />
          <span>Export CSV</span>
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="p-3 px-4 rounded-lg bg-primary/10 border border-primary/30 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              {selectedIds.length} candidate{selectedIds.length !== 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-muted-foreground hover:underline cursor-pointer"
            >
              (Clear selection)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusChange("SHORTLISTED")}
              className="h-7 text-xs border-purple-800/40 text-purple-400 hover:bg-purple-950/30 gap-1 font-mono cursor-pointer"
            >
              <Sparkles className="size-3" />
              <span>Bulk Shortlist</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusChange("INTERVIEWING")}
              className="h-7 text-xs border-amber-800/40 text-amber-400 hover:bg-amber-950/30 gap-1 font-mono cursor-pointer"
            >
              <Calendar className="size-3" />
              <span>Bulk Interview</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusChange("REJECTED")}
              className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 gap-1 font-mono cursor-pointer"
            >
              <XCircle className="size-3" />
              <span>Bulk Reject</span>
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading candidate submissions...
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-lg border border-border bg-card/40 p-12 text-center space-y-3">
          <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
            <Users className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">No candidate applications yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Once candidates submit their resumes to your open jobs, they will appear here in real time.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === applications.length && applications.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border accent-primary size-3.5 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Candidate</th>
                  <th className="py-3 px-4 font-semibold">Job Applied</th>
                  <th className="py-3 px-4 font-semibold">Match Fit</th>
                  <th className="py-3 px-4 font-semibold">Scorecard</th>
                  <th className="py-3 px-4 font-semibold">Applied Date</th>
                  <th className="py-3 px-4 font-semibold">Resume / Docs</th>
                  <th className="py-3 px-4 font-semibold">Hiring Pipeline Stage</th>
                  <th className="py-3 px-4 font-semibold text-right">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(app.id)}
                        onChange={() => toggleSelectOne(app.id)}
                        className="rounded border-border accent-primary size-3.5 cursor-pointer"
                      />
                    </td>
                    {/* Candidate Identity */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground text-sm">
                        {app.candidate?.name || "Candidate"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Mail className="size-3 text-muted-foreground" />
                        <span>{app.candidate?.email}</span>
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                          <Phone className="size-3 text-muted-foreground" />
                          <span>{app.phone}</span>
                        </div>
                      )}
                      {app.referralCode && (
                        <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Sparkles className="size-2.5" />
                          <span>Ref: {app.referralCode}</span>
                        </div>
                      )}
                      {((app.resumeAnomalyScore && app.resumeAnomalyScore >= 70) || app.resumeAnomalyFlags) && (
                        <div
                          className="inline-flex items-center gap-1 mt-1 ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 cursor-pointer"
                          onClick={() => setPreviewingApp(app)}
                          title="Gemini AI Flagged: Prompt Injection / Resume Anomaly Detected"
                        >
                          <ShieldAlert className="size-2.5" />
                          <span>AI Shield Alert</span>
                        </div>
                      )}
                    </td>

                    {/* Job */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">
                        {app.job?.title || "Job"}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {app.job?.location} [{app.job?.workplaceType}]
                      </div>
                    </td>

                    {/* Match Fit Score */}
                    <td className="py-3.5 px-4">
                      <ApplicationMatchBadge applicationId={app.id} />
                    </td>

                    {/* Scorecard Average Rating */}
                    <td className="py-3.5 px-4">
                      {app.averageRating !== null && app.averageRating !== undefined ? (
                        <button
                          type="button"
                          onClick={() => setPreviewingApp(app)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                          title="Click to view detailed scorecard"
                        >
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span>{app.averageRating.toFixed(1)}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            ({app.reviewCount || 0})
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPreviewingApp(app)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Click to evaluate candidate"
                        >
                          <Star className="size-3 text-muted-foreground/60" />
                          <span>Not rated</span>
                        </button>
                      )}
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    {/* Resume Document Link */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => setPreviewingApp(app)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary border border-border text-xs font-mono text-primary hover:bg-secondary/80 transition-colors cursor-pointer"
                      >
                        <FileText className="size-3.5" />
                        <span>Preview Resume</span>
                      </button>
                    </td>

                    {/* Status Dropdown & Schedule Action */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app, e.target.value as ApplicationStatus)
                          }
                          className="h-8 px-2.5 rounded bg-background border border-border text-xs font-mono font-medium focus:outline-hidden focus:border-primary cursor-pointer text-foreground"
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="REVIEWING">Reviewing</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEWING">Interviewing</option>
                          <option value="OFFERED">Offered</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="WITHDRAWN">Withdrawn</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => setSchedulingApp(app)}
                          title="Schedule live video interview"
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors cursor-pointer border border-border/60 hover:border-border"
                        >
                          <Calendar className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setOfferingApp(app)}
                          title="Generate formal employment offer letter with e-signature"
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer border border-border/60 hover:border-border"
                        >
                          <Award className="size-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Pitch / Cover Note Button */}
                    <td className="py-3.5 px-4 text-right">
                      {app.coverLetter ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedNote({
                              candidateName: app.candidate?.name || "Candidate",
                              note: app.coverLetter!,
                            })
                          }
                          className="h-7 px-2 text-xs text-primary hover:bg-primary/10 gap-1 font-mono"
                        >
                          <FileText className="size-3.5" />
                          <span>View Note</span>
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Note View Dialog */}
      <Dialog
        open={Boolean(selectedNote)}
        onOpenChange={(open) => !open && setSelectedNote(null)}
      >
        <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-xl">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-base font-bold text-foreground">
              Candidate Note: {selectedNote?.candidateName}
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 text-xs text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
            {selectedNote?.note}
          </div>
          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedNote(null)}
              className="h-8 text-xs border-border"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* In-App Resume PDF Previewer Modal */}
      <ResumePreviewModal
        application={previewingApp}
        open={Boolean(previewingApp)}
        onOpenChange={(open) => {
          if (!open) setPreviewingApp(null);
        }}
      />

      {/* Live Interview Scheduling Modal */}
      <ScheduleInterviewModal
        application={schedulingApp}
        open={Boolean(schedulingApp)}
        onOpenChange={(open) => {
          if (!open) setSchedulingApp(null);
        }}
      />

      {/* Formal Offer Letter Generator Modal */}
      <CreateOfferModal
        applicationId={offeringApp?.id || ""}
        candidateName={offeringApp?.candidate?.name || "Candidate"}
        jobTitle={offeringApp?.job?.title || ""}
        companyName={offeringApp?.job?.companyName || ""}
        open={Boolean(offeringApp)}
        onOpenChange={(open) => {
          if (!open) setOfferingApp(null);
        }}
      />

      {/* Intelligent Skill Gap Rejection Modal */}
      <SkillGapRejectionModal
        application={rejectingApp}
        open={Boolean(rejectingApp)}
        onOpenChange={(open) => {
          if (!open) setRejectingApp(null);
        }}
      />
    </div>
  );
}

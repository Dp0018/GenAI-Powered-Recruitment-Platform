"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ExternalLink,
  Loader2,
  FileText,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import { ResumePreviewModal } from "./resume-preview-modal";
import { ScheduleInterviewModal } from "@/features/interviews/components/schedule-interview-modal";
import { ApplicationMatchBadge } from "./application-match-badge";

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

  const applications = data?.content || [];
  const totalElements = data?.totalElements || 0;

  const handleStatusChange = (
    app: ApplicationItem,
    newStatus: ApplicationStatus
  ) => {
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
      </div>

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
              Once candidates submit their resumes to your open requisitions, they will appear here in real time.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Candidate</th>
                  <th className="py-3 px-4 font-semibold">Requisition Applied</th>
                  <th className="py-3 px-4 font-semibold">Match Fit</th>
                  <th className="py-3 px-4 font-semibold">Applied Date</th>
                  <th className="py-3 px-4 font-semibold">Resume / Docs</th>
                  <th className="py-3 px-4 font-semibold">Hiring Pipeline Stage</th>
                  <th className="py-3 px-4 font-semibold text-right">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/30 transition-colors">
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
                    </td>

                    {/* Requisition */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">
                        {app.job?.title || "Requisition"}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {app.job?.location} [{app.job?.workplaceType}]
                      </div>
                    </td>

                    {/* Match Fit Score */}
                    <td className="py-3.5 px-4">
                      <ApplicationMatchBadge applicationId={app.id} />
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
                          className="h-8 px-2.5 rounded bg-background border border-border text-xs font-mono font-medium focus:outline-none focus:border-primary cursor-pointer text-foreground"
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
    </div>
  );
}

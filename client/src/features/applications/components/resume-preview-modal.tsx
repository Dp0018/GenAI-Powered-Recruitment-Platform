"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicationItem, ApplicationStatus } from "../types/application";
import { useUpdateApplicationStatusMutation } from "../hooks/use-applications";
import {
  FileText,
  ExternalLink,
  Download,
  Mail,
  Briefcase,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Loader2,
  Send,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface ResumePreviewModalProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumePreviewModal({
  application,
  open,
  onOpenChange,
}: ResumePreviewModalProps) {
  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const [customNote, setCustomNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);

  if (!application) return null;

  const handleStageTransition = (status: ApplicationStatus) => {
    setSelectedStatus(status);
    updateStatusMutation.mutate(
      {
        applicationId: application.id,
        payload: {
          status,
          notes: customNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setCustomNote("");
          setShowNoteInput(false);
          setSelectedStatus(null);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 bg-card border-border overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-4 px-6 border-b border-border bg-secondary/30 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <span>{application.candidate.name}</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                  {application.status}
                </span>
              </DialogTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="size-3 text-primary" />
                  {application.candidate.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Briefcase className="size-3 text-primary" />
                  {application.job.title}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-6">
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-border text-xs gap-1.5 font-mono"
              >
                <Download className="size-3.5" />
                <span>Open File</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </Button>
            </a>
          </div>
        </DialogHeader>

        {/* Modal Body: Two Columns (PDF Viewer & Cover Letter / Fast Actions) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* PDF Viewer (3 Columns) */}
          <div className="lg:col-span-3 h-full bg-slate-950/60 relative flex flex-col">
            <iframe
              src={`${application.resumeUrl}#toolbar=0`}
              className="w-full h-full border-0"
              title={`${application.candidate.name} Resume`}
            />
          </div>

          {/* Screening Panel & Cover Note (1 Column) */}
          <div className="lg:col-span-1 p-5 flex flex-col justify-between overflow-y-auto bg-card/60 space-y-4">
            <div className="space-y-4">
              {/* Pitch / Cover Letter */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-primary" />
                  <span>Candidate Pitch</span>
                </h4>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground/90 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {application.coverLetter || "No cover note provided by candidate."}
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-2 text-xs divide-y divide-border/60">
                <div className="flex justify-between py-1.5 first:pt-0">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-mono text-foreground">{application.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Applied</span>
                  <span className="font-mono text-foreground">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Decision Stage Buttons */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Quick Decision
                </h4>
                <button
                  type="button"
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="text-[11px] font-mono text-primary hover:underline cursor-pointer"
                >
                  {showNoteInput ? "Hide Note" : "+ Add Note to Candidate"}
                </button>
              </div>

              {showNoteInput && (
                <div className="space-y-1.5">
                  <Input
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Feedback note in email..."
                    className="h-8 text-xs bg-secondary/40 border-border"
                  />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    This note will be formatted into the candidate&apos;s Resend notification.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("SHORTLISTED")}
                  className="h-8 text-xs border-purple-800/40 text-purple-400 hover:bg-purple-950/30 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "SHORTLISTED" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Sparkles className="size-3" />
                  )}
                  <span>Shortlist</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("INTERVIEWING")}
                  className="h-8 text-xs border-amber-800/40 text-amber-400 hover:bg-amber-950/30 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "INTERVIEWING" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Calendar className="size-3" />
                  )}
                  <span>Interview</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("OFFERED")}
                  className="h-8 text-xs border-emerald-800/40 text-emerald-400 hover:bg-emerald-950/30 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "OFFERED" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3" />
                  )}
                  <span>Offer</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("REJECTED")}
                  className="h-8 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "REJECTED" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <XCircle className="size-3" />
                  )}
                  <span>Reject</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

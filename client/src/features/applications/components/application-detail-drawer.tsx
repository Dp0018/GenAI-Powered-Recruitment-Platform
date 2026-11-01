"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicationItem, ApplicationStatus } from "../types/application";
import { useWithdrawApplicationMutation } from "../hooks/use-applications";
import {
  FileText,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Ban,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useExplainApplicationMatchQuery } from "@/features/ai/hooks/use-ai";
import { ExplainableMatchCard } from "@/features/ai/components/explainable-match-card";

interface ApplicationDetailDrawerProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationDetailDrawer({
  application,
  open,
  onOpenChange,
}: ApplicationDetailDrawerProps) {
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [showXai, setShowXai] = useState(false);

  const {
    data: xaiData,
    isLoading: isXaiLoading,
    refetch: refetchXai,
  } = useExplainApplicationMatchQuery(
    application?.id,
    Boolean(application?.id && showXai)
  );

  const withdrawMutation = useWithdrawApplicationMutation(() => {
    setConfirmWithdraw(false);
    onOpenChange(false);
  });

  if (!application) return null;

  const canWithdraw =
    application.status !== "WITHDRAWN" &&
    application.status !== "REJECTED" &&
    application.status !== "OFFERED";

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case "APPLIED":
        return 0;
      case "REVIEWING":
      case "SHORTLISTED":
        return 1;
      case "INTERVIEWING":
        return 2;
      case "OFFERED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStage = getStageIndex(application.status);
  const isTerminalNegative =
    application.status === "REJECTED" || application.status === "WITHDRAWN";

  const stages = [
    { label: "Submitted", desc: "Application delivered to hiring team" },
    { label: "Screening", desc: "Resume under recruiter evaluation" },
    { label: "Interview", desc: "Technical & culture screening" },
    { label: "Decision", desc: "Final hiring offer or conclusion" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground p-6 sm:p-7 rounded-xl shadow-2xl">
        <DialogHeader className="space-y-2 text-left border-b border-border pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
              <Building2 className="size-3 text-primary" />
              <span>{application.job?.companyName || "Organization"}</span>
              {application.job?.companyVerificationStatus === "VERIFIED" && (
                <ShieldCheck className="size-3 text-emerald-400" />
              )}
            </div>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                application.status === "OFFERED"
                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                  : application.status === "REJECTED"
                    ? "bg-rose-950/40 text-rose-400 border-rose-800/40"
                    : application.status === "WITHDRAWN"
                      ? "bg-secondary text-muted-foreground border-border"
                      : application.status === "INTERVIEWING"
                        ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                        : "bg-amber-950/40 text-amber-400 border-amber-800/40"
              }`}
            >
              {application.status}
            </span>
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {application.job?.title}
          </DialogTitle>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="size-3" />
              {application.job?.location}
            </span>
            <span>•</span>
            <span className="font-mono">{application.job?.workplaceType}</span>
            <span>•</span>
            <span className="font-mono">
              {application.job?.jobType?.replace("_", " ")}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4 text-left">
          {/* Stage Progression Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
              Hiring Pipeline Progression
            </h4>

            {isTerminalNegative ? (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                  application.status === "WITHDRAWN"
                    ? "bg-secondary/60 border-border text-muted-foreground"
                    : "bg-rose-950/30 border-rose-900/40 text-rose-300"
                }`}
              >
                {application.status === "WITHDRAWN" ? (
                  <Ban className="size-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <div>
                  <span className="font-semibold block">
                    {application.status === "WITHDRAWN"
                      ? "Application Withdrawn by Candidate"
                      : "Application Concluded / Not Moving Forward"}
                  </span>
                  <span className="text-[11px] opacity-80">
                    {application.status === "WITHDRAWN"
                      ? "You voluntarily removed this submission from active hiring consideration."
                      : "The hiring team decided not to advance your application for this requisition."}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {stages.map((stage, idx) => {
                  const isDone = currentStage > idx;
                  const isCurrent = currentStage === idx;
                  return (
                    <div key={stage.label} className="space-y-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-colors ${
                          isDone || isCurrent
                            ? "bg-primary"
                            : "bg-secondary border border-border"
                        }`}
                      />
                      <div className="space-y-0.5">
                        <div
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? "text-primary"
                              : isDone
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {stage.label}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recruiter Feedback Note (If Provided) */}
          {application.feedbackNote && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <MessageSquare className="size-3.5" />
                <span>Recruiter Feedback Note</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed italic bg-card/60 p-3 rounded border border-border">
                &ldquo;{application.feedbackNote}&rdquo;
              </p>
            </div>
          )}

          {/* Explainable AI Fit Engine Insights */}
          <div className="p-4 rounded-xl bg-card/60 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <Sparkles className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Explainable AI (XAI) Fit Breakdown
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Powered by Gemini 3.5 Flash
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowXai(!showXai);
                  if (!showXai) refetchXai();
                }}
                disabled={isXaiLoading}
                className="h-7 text-[11px] font-mono gap-1"
              >
                {isXaiLoading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Sparkles className="size-3 text-primary" />
                )}
                <span>{showXai ? "Hide Analysis" : "View Fit Analysis"}</span>
              </Button>
            </div>

            {showXai && (
              <div className="pt-2">
                {isXaiLoading ? (
                  <div className="p-6 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span className="text-[11px] font-mono">Synthesizing match factor breakdown...</span>
                  </div>
                ) : xaiData ? (
                  <ExplainableMatchCard data={xaiData} />
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground font-mono">
                    Could not load AI fit breakdown.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submission Details */}
          <div className="p-4 rounded-lg bg-card/60 border border-border space-y-3 text-xs">
            <h4 className="font-semibold text-foreground">
              Submission Records
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground font-mono">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground/70 block">
                  Submitted On
                </span>
                <span className="text-foreground">
                  {new Date(application.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {application.phone && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-muted-foreground/70 block">
                    Contact Phone
                  </span>
                  <span className="text-foreground">{application.phone}</span>
                </div>
              )}
            </div>

            {application.status === "OFFERED" && (
              <div className="p-4 rounded-xl bg-linear-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-600/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="size-4" />
                    <span>Official Offer Extended! 🎉</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/80">
                    Pending Action
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  The hiring team has extended a formal employment agreement
                  with full compensation and electronic signature workflow.
                </p>
                <div className="pt-1">
                  <Link
                    href="/dashboard/candidate?tab=offers"
                    onClick={() => onOpenChange(false)}
                  >
                    <Button
                      size="sm"
                      className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
                    >
                      <span>View & E-Sign Offer Letter</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">Uploaded Resume:</span>
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-foreground text-xs font-mono border border-border transition-colors"
              >
                <FileText className="size-3 text-primary" />
                <span>Preview Document</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
            </div>

            {application.coverLetter && (
              <div className="pt-2 border-t border-border space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground/70 block">
                  Cover Letter
                </span>
                <p className="text-xs text-foreground bg-background p-2.5 rounded border border-border whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {application.coverLetter}
                </p>
              </div>
            )}

            {application.screeningAnswers &&
              application.screeningAnswers.length > 0 && (
                <div className="pt-2 border-t border-border space-y-2">
                  <span className="text-[10px] uppercase text-muted-foreground/70 block font-semibold">
                    Pre-Screening Question Responses
                  </span>
                  <div className="space-y-2">
                    {application.screeningAnswers.map((ans, idx) => (
                      <div
                        key={ans.id || idx}
                        className="p-2.5 rounded bg-background border border-border space-y-1"
                      >
                        <div className="text-[11px] font-medium text-foreground">
                          {idx + 1}. {ans.questionText}
                        </div>
                        <div className="text-xs text-primary font-mono pl-3 border-l-2 border-primary/40">
                          {ans.answerText}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Actions & Withdrawal */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border">
            {application.job?.slug ? (
              <Link
                href={`/jobs/${application.job.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
              >
                <span>View Public Job Listing</span>
                <ExternalLink className="size-3" />
              </Link>
            ) : (
              <div />
            )}

            {canWithdraw && (
              <div>
                {!confirmWithdraw ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmWithdraw(true)}
                    className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10 text-xs gap-1.5 rounded-md"
                  >
                    <Ban className="size-3.5" />
                    <span>Withdraw Application</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Confirm withdraw?
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmWithdraw(false)}
                      className="h-7 px-2 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={withdrawMutation.isPending}
                      onClick={() => withdrawMutation.mutate(application.id)}
                      className="h-7 px-2.5 text-xs gap-1"
                    >
                      {withdrawMutation.isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        "Yes, Withdraw"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

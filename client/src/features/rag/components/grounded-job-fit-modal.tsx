"use client";

import React, { useState } from "react";
import { useGroundedJobFitQuery } from "../hooks/use-rag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Quote,
  Loader2,
  FileCheck,
  Target,
} from "lucide-react";

interface GroundedJobFitModalProps {
  jobId: string;
  candidateId?: string;
  jobTitle?: string;
  triggerButton?: React.ReactNode;
}

export function GroundedJobFitModal({
  jobId,
  candidateId,
  jobTitle,
  triggerButton,
}: GroundedJobFitModalProps) {
  const [open, setOpen] = useState(false);
  const { data: fitData, isLoading } = useGroundedJobFitQuery(
    jobId,
    candidateId,
    open
  );

  return (
    <>
      {triggerButton ? (
        <span onClick={() => setOpen(true)}>{triggerButton}</span>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-1.5 h-8 text-xs border-border text-foreground hover:bg-muted"
        >
          <FileCheck className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Grounded Fit Analysis</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-border bg-card">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-base font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Grounded Job-to-Resume Fit (RAG)
              </span>
              {fitData && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    Grade {fitData.fitGrade}
                  </Badge>
                  <span className="text-xs font-mono font-medium">
                    {fitData.overallFitScore}% Match
                  </span>
                </div>
              )}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {jobTitle || fitData?.jobTitle || "Requisition"} &bull; Evaluated line-by-line against verified portfolio records.
            </p>
          </DialogHeader>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-xs">Analyzing resume citations & competency alignment...</p>
            </div>
          ) : fitData ? (
            <div className="space-y-5 py-2 text-sm">
              {/* Executive Summary */}
              <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
                {fitData.executiveSummary}
              </div>

              {/* Requirements Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Competency Dimensions & Evidence
                </h4>
                <div className="space-y-2.5">
                  {fitData.requirementsBreakdown.map((req, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-border bg-card space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground">
                          {req.requirement}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {req.status === "VERIFIED_MATCH" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified ({req.matchScore}%)
                            </span>
                          ) : req.status === "PARTIAL_MATCH" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                              <AlertTriangle className="w-3 h-3" />
                              Partial ({req.matchScore}%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                              <HelpCircle className="w-3 h-3" />
                              Gap ({req.matchScore}%)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Evidence citation snippet */}
                      <div className="rounded bg-muted/40 p-2 text-[11px] font-mono text-muted-foreground border-l-2 border-border flex items-start gap-1.5">
                        <Quote className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{req.evidenceCitation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Gaps Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border bg-card space-y-1.5">
                  <h5 className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Strengths
                  </h5>
                  <ul className="space-y-1 text-muted-foreground">
                    {fitData.verifiedStrengths.map((s, idx) => (
                      <li key={idx} className="leading-relaxed">&bull; {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card space-y-1.5">
                  <h5 className="font-semibold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Development Gaps
                  </h5>
                  <ul className="space-y-1 text-muted-foreground">
                    {fitData.identifiedSkillGaps.map((g, idx) => (
                      <li key={idx} className="leading-relaxed">&bull; {g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              {fitData.interviewRecommendations && (
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1 text-xs">
                  <span className="font-semibold text-foreground">Interview Screening Guidance:</span>
                  <ul className="space-y-1 text-muted-foreground list-disc pl-4 pt-1">
                    {fitData.interviewRecommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Unable to generate fit analysis. Please ensure candidate profile is updated.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

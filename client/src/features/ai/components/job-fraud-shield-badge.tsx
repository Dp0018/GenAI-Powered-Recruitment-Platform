"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, ShieldAlert, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";

interface JobFraudShieldBadgeProps {
  fraudScore?: number | null;
  riskLevel?: string | null;
  fraudReasons?: string | string[] | null;
  isQuarantined?: boolean | null;
  className?: string;
}

export function JobFraudShieldBadge({
  fraudScore,
  riskLevel,
  fraudReasons,
  isQuarantined,
  className = "",
}: JobFraudShieldBadgeProps) {
  const actualScore = fraudScore ?? 5;
  const actualRisk = riskLevel ?? "LOW";
  const actualQuarantined = isQuarantined ?? false;
  const [isOpen, setIsOpen] = useState(false);

  let parsedReasons: string[] = [];
  if (Array.isArray(fraudReasons)) {
    parsedReasons = fraudReasons;
  } else if (typeof fraudReasons === "string") {
    try {
      parsedReasons = JSON.parse(fraudReasons);
    } catch {
      parsedReasons = [fraudReasons];
    }
  }

  const isHighRisk = actualScore >= 70 || actualQuarantined;
  const isModerate = actualScore >= 40 && actualScore < 70;

  const trustScore = Math.max(1, 100 - actualScore);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer border ${
          isHighRisk
            ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
            : isModerate
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20"
        } ${className}`}
        title="Verified with Gemini AI Fraud Detection Shield. Click to inspect safety report."
      >
        {isHighRisk ? (
          <ShieldAlert className="size-3 text-rose-400" />
        ) : isModerate ? (
          <AlertTriangle className="size-3 text-amber-400" />
        ) : (
          <ShieldCheck className="size-3 text-emerald-400" />
        )}
        <span>
          {isHighRisk
            ? "AI Flagged"
            : isModerate
            ? `Safety: ${trustScore}%`
            : `AI Trust: ${trustScore}%`}
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border text-foreground p-6 rounded-xl shadow-2xl">
          <DialogHeader className="space-y-1.5 text-left border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                {isHighRisk ? (
                  <ShieldAlert className="size-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="size-5 text-emerald-400" />
                )}
                <span>AI Trust & Fraud Protection Report</span>
              </DialogTitle>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="size-2.5" />
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time cyber safety evaluation protecting job seekers against scams, phishing, and fake requisitions.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-3 text-left">
            {/* Score Metric Card */}
            <div className="p-3.5 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-mono">Platform Trust Index</span>
                <div className="text-xl font-bold font-mono text-foreground flex items-center gap-2 mt-0.5">
                  <span>{trustScore} / 100</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      isHighRisk
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : isModerate
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {isHighRisk ? "High Risk" : isModerate ? "Moderate" : "Verified Safe"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground font-mono">Fraud Probability</span>
                <div className="text-sm font-bold font-mono text-muted-foreground mt-0.5">
                  {fraudScore}%
                </div>
              </div>
            </div>

            {/* Analysis Findings */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-foreground">AI Safety Evaluation</h5>
              {parsedReasons.length > 0 ? (
                <div className="space-y-1.5">
                  {parsedReasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded border border-border bg-card/60 text-xs text-muted-foreground flex items-start gap-2"
                    >
                      {isHighRisk ? (
                        <AlertTriangle className="size-3.5 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 rounded border border-border bg-card/60 text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                  <span>Standard verified employment requisition with standard compensation and no suspicious indicators.</span>
                </div>
              )}
            </div>

            {/* Candidate Safety Tips */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground space-y-1 font-mono">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <ShieldCheck className="size-3 text-primary" />
                JobPortal Safe Hiring Guarantee:
              </span>
              <p>• Legitimate employers will never ask for wire deposits, check cashings, or gift card reimbursements.</p>
              <p>• Always keep correspondence and video interview coordination inside the verified JobPortal platform.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

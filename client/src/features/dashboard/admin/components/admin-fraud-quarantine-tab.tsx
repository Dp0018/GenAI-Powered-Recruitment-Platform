"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useQuarantinedJobsQuery,
  useApproveQuarantinedJobMutation,
  useRejectQuarantinedJobMutation,
} from "@/features/ai/hooks/use-ai";
import { JobItem } from "@/features/jobs/types/job";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Building2,
  MapPin,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AdminFraudQuarantineTab() {
  const [inspectJob, setInspectJob] = useState<JobItem | null>(null);

  const { data, isLoading, refetch } = useQuarantinedJobsQuery(0, 50);
  const approveMutation = useApproveQuarantinedJobMutation();
  const rejectMutation = useRejectQuarantinedJobMutation();

  const jobs = data?.content || [];
  const totalQuarantined = data?.totalElements || 0;

  const parseReasons = (reasons?: string | string[] | null): string[] => {
    if (!reasons) return [];
    if (Array.isArray(reasons)) return reasons;
    try {
      return JSON.parse(reasons);
    } catch {
      return [reasons];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card explaining quarantine */}
      <div className="p-5 rounded-xl border border-rose-500/20 bg-linear-to-r from-rose-950/30 via-rose-900/10 to-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="size-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-foreground">
                AI Trust Guardian: High-Risk Quarantine Queue
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Sparkles className="size-2.5" />
                Gemini 3.8 Flash Scan
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Postings flagged with a Fraud Risk Score &ge; 70% (scam indicators, upfront fee requests, off-platform communication channels, or phishing) are automatically quarantined from public feeds until platform admin review.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-bold font-mono text-rose-400">
            {totalQuarantined}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground uppercase">
            Quarantined Postings
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="rounded-xl border border-border bg-card/60 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="text-xs font-semibold text-foreground flex items-center gap-2">
            <span>Pending Flagged Requisitions</span>
            <span className="text-[11px] font-mono text-muted-foreground">({jobs.length})</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8 text-xs font-mono"
          >
            Refresh Queue
          </Button>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground font-mono">
              Loading quarantine stream...
            </span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="size-12 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="size-6" />
            </div>
            <div className="text-sm font-semibold text-foreground">
              Quarantine Queue is Clean
            </div>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              No fraudulent or suspicious job postings detected. Gemini AI Trust Guardian is continuously auditing all incoming listings.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => {
              const reasons = parseReasons(job.fraudReasons);
              return (
                <div
                  key={job.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="space-y-2.5 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        Risk: {job.fraudRiskScore || 85}% ({job.fraudRiskLevel || "HIGH"})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Quarantined
                      </span>
                      <span className="text-xs font-semibold text-foreground font-mono">
                        {job.company?.name || "Corporate Employer"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-foreground">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary" />
                          {job.location}
                        </span>
                        <span>&bull;</span>
                        <span>{job.workplaceType}</span>
                        <span>&bull;</span>
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Fraud flags */}
                    {reasons.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
                          Gemini AI Flagged Indicators:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {reasons.map((reason, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] bg-rose-950/40 border border-rose-800/40 text-rose-300 font-sans"
                            >
                              &bull; {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInspectJob(job)}
                      className="h-8 text-xs font-mono gap-1.5"
                    >
                      <Eye className="size-3.5" />
                      <span>Inspect</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(job.id)}
                      disabled={approveMutation.isPending}
                      className="h-8 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-3.5" />
                      )}
                      <span>Approve & Publish</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectMutation.mutate(job.id)}
                      disabled={rejectMutation.isPending}
                      className="h-8 text-xs font-mono font-semibold gap-1.5"
                    >
                      {rejectMutation.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <XCircle className="size-3.5" />
                      )}
                      <span>Reject & Close</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {inspectJob && (
        <Dialog open={Boolean(inspectJob)} onOpenChange={() => setInspectJob(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="size-5 text-rose-400" />
                <span>Job Posting Inspection & Audit</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-mono">
                Requisition ID: {inspectJob.id} &bull; Company: {inspectJob.company?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
                    Gemini AI Trust Score Analysis
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    Risk Score: {inspectJob.fraudRiskScore}% ({inspectJob.fraudRiskLevel})
                  </span>
                </div>
                <div className="space-y-1">
                  {parseReasons(inspectJob.fraudReasons).map((r, i) => (
                    <div key={i} className="text-xs text-foreground/90 flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">&bull;</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  Full Role Specification
                </h4>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border text-xs text-foreground leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-sans">
                  {inspectJob.description}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInspectJob(null)}
                  className="h-8 text-xs font-mono"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    approveMutation.mutate(inspectJob.id);
                    setInspectJob(null);
                  }}
                  className="h-8 text-xs font-mono bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Clear & Publish</span>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    rejectMutation.mutate(inspectJob.id);
                    setInspectJob(null);
                  }}
                  className="h-8 text-xs font-mono gap-1.5"
                >
                  <XCircle className="size-3.5" />
                  <span>Confirm Scam & Reject</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

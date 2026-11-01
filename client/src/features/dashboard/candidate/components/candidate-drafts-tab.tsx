"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApplyJobModal } from "@/features/applications/components/apply-job-modal";
import {
  FileEdit,
  Building2,
  Clock,
  ArrowRight,
  Trash2,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface SavedDraft {
  jobId: string;
  jobTitle: string;
  companyName: string;
  resumeUrl?: string;
  phone?: string;
  coverLetter?: string;
  answers?: Record<string, string>;
  savedAt: string;
}

export function CandidateDraftsTab() {
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [activeDraft, setActiveDraft] = useState<SavedDraft | null>(null);

  const loadDrafts = () => {
    if (typeof window === "undefined") return;
    const found: SavedDraft[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("job_application_draft_")) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "{}");
          if (item && item.jobId) {
            found.push(item);
          }
        } catch {
          // ignore parsing error
        }
      }
    }
    found.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    setDrafts(found);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleDeleteDraft = (jobId: string, title: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`job_application_draft_${jobId}`);
    toast.info(`Draft for "${title}" deleted`);
    loadDrafts();
  };

  if (drafts.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card/40 space-y-3">
        <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
          <FileEdit className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">No active application drafts</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            When you begin applying for a position with screening questions or a pitch, you can click &quot;Save Draft&quot; to resume and submit at any time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileEdit className="size-4 text-primary" />
            <span>Saved Application Drafts</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Continue where you left off before final submission to employers.
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
          {drafts.length} In Progress
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {drafts.map((draft) => {
          const answerCount = Object.keys(draft.answers || {}).length;
          const hasResume = Boolean(draft.resumeUrl);
          const hasNote = Boolean(draft.coverLetter?.trim());

          return (
            <div
              key={draft.jobId}
              className="p-4 rounded-xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {draft.jobTitle}
                  </h4>
                  <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
                    Draft
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="size-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{draft.companyName}</span>
                  <span>•</span>
                  <Clock className="size-3 text-muted-foreground" />
                  <span>Saved {new Date(draft.savedAt).toLocaleDateString()} at {new Date(draft.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {hasResume && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      <CheckCircle2 className="size-3 text-emerald-400" />
                      Resume attached
                    </span>
                  )}
                  {hasNote && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      <FileText className="size-3 text-primary" />
                      Pitch drafted
                    </span>
                  )}
                  {answerCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      <Sparkles className="size-3 text-primary" />
                      {answerCount} answers saved
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDeleteDraft(draft.jobId, draft.jobTitle)}
                  className="p-2 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                  title="Discard draft"
                >
                  <Trash2 className="size-4" />
                </button>

                <Button
                  size="sm"
                  onClick={() => setActiveDraft(draft)}
                  className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium gap-1.5 shadow-xs"
                >
                  <span>Resume Application</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {activeDraft && (
        <ApplyJobModal
          open={Boolean(activeDraft)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveDraft(null);
              loadDrafts();
            }
          }}
          jobId={activeDraft.jobId}
          jobTitle={activeDraft.jobTitle}
          companyName={activeDraft.companyName}
        />
      )}
    </div>
  );
}

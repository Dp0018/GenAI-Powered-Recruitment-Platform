"use client";

import React, { useState, useMemo } from "react";
import { ApplicationItem } from "../types/application";
import { useExplainApplicationMatchQuery } from "@/features/ai/hooks/use-ai";
import { useUpdateApplicationStatusMutation } from "../hooks/use-applications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Mail,
  Plus,
  X,
  Send,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface SkillGapRejectionModalProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SkillGapRejectionModal({
  application,
  open,
  onOpenChange,
  onSuccess,
}: SkillGapRejectionModalProps) {
  const updateStatusMutation = useUpdateApplicationStatusMutation();

  const { data: xaiData, isLoading: isXaiLoading } = useExplainApplicationMatchQuery(
    application?.id,
    Boolean(application?.id && open)
  );

  const [unselectedSkills, setUnselectedSkills] = useState<string[]>([]);
  const [extraSkills, setExtraSkills] = useState<string[]>([]);
  const [userCustomNote, setUserCustomNote] = useState<string | null>(null);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [sendEmail, setSendEmail] = useState(true);

  // All available missing skills from AI + extra added by recruiter
  const allDetectedSkills = useMemo(() => {
    const aiSkills = xaiData?.missingSkills || [];
    const combined = [...aiSkills];
    for (const extra of extraSkills) {
      if (!combined.includes(extra)) combined.push(extra);
    }
    return combined;
  }, [xaiData?.missingSkills, extraSkills]);

  // Currently active selected missing skills
  const selectedMissingSkills = useMemo(() => {
    return allDetectedSkills.filter((s) => !unselectedSkills.includes(s));
  }, [allDetectedSkills, unselectedSkills]);

  // Generated default feedback note
  const generatedFeedbackNote = useMemo(() => {
    if (!application) return "";

    const candidateName = application.candidate.name;
    const jobTitle = application.job.title;
    const companyName = application.job.companyName;
    const score = xaiData?.overallScore;

    let skillSentence = "";
    if (selectedMissingSkills.length > 0) {
      skillSentence = `Specifically, our current production requirements require immediate depth in the following core competencies: ${selectedMissingSkills.join(
        ", "
      )}.`;
    } else {
      skillSentence =
        "At this stage, our requirements call for deeper specialization in certain core technical competencies outlined in the role.";
    }

    const scoreClause = score ? ` (Candidate Resume Match: ${score}%)` : "";

    return `Dear ${candidateName},\n\nThank you for taking the time to share your background and apply for the ${jobTitle} role at ${companyName}.\n\nAfter a thorough evaluation of your application${scoreClause}, our engineering hiring team has decided to move forward with other candidates whose immediate experience more closely aligns with this role.\n\n${skillSentence}\n\nWe genuinely appreciate your time and enthusiasm. We encourage you to continue strengthening these areas and keep an eye on our careers board for future openings that match your evolving skill set.\n\nWarm regards,\nThe Hiring Team at ${companyName}`;
  }, [application, xaiData?.overallScore, selectedMissingSkills]);

  const activeFeedbackNote = userCustomNote ?? generatedFeedbackNote;

  const toggleSkill = (skill: string) => {
    setUnselectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!extraSkills.includes(trimmed)) {
      setExtraSkills((prev) => [...prev, trimmed]);
      setUnselectedSkills((prev) => prev.filter((s) => s !== trimmed));
    }
    setCustomSkillInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const handleConfirmRejection = () => {
    if (!application) return;

    updateStatusMutation.mutate(
      {
        applicationId: application.id,
        payload: {
          status: "REJECTED",
          notes: sendEmail && activeFeedbackNote.trim() ? activeFeedbackNote.trim() : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            `Application rejected. Constructive skill gap feedback delivered to ${application.candidate.name}.`
          );
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-2xl bg-card/95 border border-border/80 text-foreground rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl max-h-[92vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="text-left pb-2">
          <div className="flex items-start gap-4">
            <div className="size-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
              <Ban className="size-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
                Skill Gap Rejection & Feedback
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Provide constructive skill gap transparency for{" "}
                <span className="font-semibold text-foreground">{application.candidate.name}</span> applying
                for <span className="font-semibold text-foreground">{application.job.title}</span>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* AI Resume Match Score Summary Card */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-sky-400" />
                <span>AI Resume Qualification Fit</span>
              </span>

              {isXaiLoading ? (
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                  <Loader2 className="size-3 animate-spin text-sky-400" />
                  Analyzing resume...
                </span>
              ) : xaiData ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                      xaiData.overallScore >= 70
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : xaiData.overallScore >= 45
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    Match Score: {xaiData.overallScore}% ({xaiData.matchGrade})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">Standard Screening</span>
              )}
            </div>

            {xaiData && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] font-mono">
                <div className="p-2 rounded-xl bg-card/60 border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Skills Score</span>
                  <span className="text-foreground font-bold">{xaiData.skillsScore}%</span>
                </div>
                <div className="p-2 rounded-xl bg-card/60 border border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Experience Depth</span>
                  <span className="text-foreground font-bold">{xaiData.experienceScore}%</span>
                </div>
                <div className="p-2 rounded-xl bg-card/60 border border-border/60 col-span-2 sm:col-span-1">
                  <span className="text-muted-foreground block text-[10px]">Domain Relevance</span>
                  <span className="text-foreground font-bold">{xaiData.domainScore}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Missing Skills Selector (Skill Gap Analysis) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-amber-400" />
                <span>Identified Missing Skills (Click to include in feedback note)</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {selectedMissingSkills.length} selected
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-secondary/30 border border-border/70 min-h-[50px]">
              {isXaiLoading ? (
                <div className="text-xs text-muted-foreground flex items-center gap-2 py-1">
                  <Loader2 className="size-3.5 animate-spin text-sky-400" />
                  <span>Scanning candidate resume for missing prerequisites...</span>
                </div>
              ) : allDetectedSkills.length > 0 ? (
                allDetectedSkills.map((skill) => {
                  const isSelected = selectedMissingSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold shadow-xs"
                          : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/60 line-through opacity-60"
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected ? (
                        <CheckCircle2 className="size-3 text-rose-400" />
                      ) : (
                        <X className="size-3 text-muted-foreground" />
                      )}
                    </button>
                  );
                })
              ) : (
                <span className="text-xs text-muted-foreground font-mono py-1">
                  No missing skills detected automatically. You can add specific skills below.
                </span>
              )}
            </div>

            {/* Add Custom Missing Skill Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add other missing skill requirement (e.g. Kubernetes, AWS, GraphQL) & press Enter..."
                className="flex-1 h-9 px-3 rounded-xl bg-secondary/40 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSkill}
                disabled={!customSkillInput.trim()}
                className="h-9 px-3 text-xs gap-1 rounded-xl border-border/80 bg-secondary/40 cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add</span>
              </Button>
            </div>
          </div>

          {/* Live Editable Email Feedback Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-sky-400" />
                <span>Candidate Feedback & Email Note Preview</span>
              </label>
              <label className="text-xs text-muted-foreground flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded border-border accent-rose-500"
                />
                <span>Send via Resend Email</span>
              </label>
            </div>

            <textarea
              rows={7}
              value={activeFeedbackNote}
              onChange={(e) => setUserCustomNote(e.target.value)}
              placeholder="Constructive feedback note..."
              className="w-full p-3 rounded-2xl bg-secondary/30 border border-border/80 text-xs font-sans text-foreground leading-relaxed placeholder:text-muted-foreground/60 outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 resize-none"
            />
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <HelpCircle className="size-3 text-muted-foreground/70" />
              <span>
                Delivered straight to <strong className="text-foreground">{application.candidate.email}</strong> and saved in their candidate applications tab.
              </span>
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2.5 pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-xl text-xs font-medium border-border/80 bg-secondary/40 hover:bg-secondary cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={updateStatusMutation.isPending}
            onClick={handleConfirmRejection}
            className="h-10 px-5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {updateStatusMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            <span>Reject & Send Skill Gap Feedback</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

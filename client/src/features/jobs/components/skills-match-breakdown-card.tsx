"use client";

import React from "react";
import Link from "next/link";
import { useJobMatchQuery } from "../hooks/use-job-match";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Target,
  Check,
} from "lucide-react";

interface SkillsMatchBreakdownCardProps {
  jobId: string;
}

export function SkillsMatchBreakdownCard({ jobId }: SkillsMatchBreakdownCardProps) {
  const { user } = useAuth();
  const { data: match, isLoading } = useJobMatchQuery(jobId);

  if (user?.role !== "CANDIDATE" || isLoading) {
    return null;
  }

  if (!match) return null;

  const { score, fitCategory, matchedSkills, missingSkills, summary } = match;

  let progressColor = "bg-primary";
  let badgeColor = "bg-secondary text-muted-foreground border-border";
  let titleText = "Moderate Skill Overlap";

  if (score >= 80) {
    progressColor = "bg-emerald-500";
    badgeColor = "bg-emerald-950/40 text-emerald-400 border-emerald-800/40";
    titleText = "Top Candidate • High Qualification Match";
  } else if (score >= 60) {
    progressColor = "bg-indigo-500";
    badgeColor = "bg-indigo-950/40 text-indigo-400 border-indigo-800/40";
    titleText = "Strong Candidate Fit";
  } else if (score >= 40) {
    progressColor = "bg-amber-500";
    badgeColor = "bg-amber-950/40 text-amber-400 border-amber-800/40";
    titleText = "Potential Fit • Some Skill Gaps";
  } else {
    progressColor = "bg-muted-foreground";
    badgeColor = "bg-secondary text-muted-foreground border-border";
    titleText = "Profile Incomplete or Low Overlap";
  }

  return (
    <div className="p-5 rounded-xl bg-card border border-border shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Target className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Candidate Compatibility Rating
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Algorithmic match between your profile skills and requisition tags.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${badgeColor}`}>
            {score}% Compatibility
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="font-semibold text-foreground">{titleText}</span>
          <span className="text-muted-foreground">{matchedSkills.length} of {matchedSkills.length + missingSkills.length} matched</span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.max(5, score)}%` }}
          />
        </div>
      </div>

      {/* Summary Note */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {summary}
      </p>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Matched Skills */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            <span>Matched Qualifications ({matchedSkills.length})</span>
          </div>
          {matchedSkills.length === 0 ? (
            <div className="text-xs text-muted-foreground font-mono">None identified</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-300 border border-emerald-800/30"
                >
                  <Check className="size-3 text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertCircle className="size-3.5" />
            <span>Missing / Unverified Skills ({missingSkills.length})</span>
          </div>
          {missingSkills.length === 0 ? (
            <div className="text-xs text-emerald-400 font-mono">Full qualification coverage!</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border"
                >
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {score === 0 && (
        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Haven&apos;t added your technical skills yet?</span>
          <Link
            href="/dashboard/candidate"
            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Update Candidate Profile</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

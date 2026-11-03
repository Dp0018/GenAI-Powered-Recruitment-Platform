"use client";

import React from "react";
import { useApplicationMatchQuery } from "@/features/jobs/hooks/use-job-match";
import { Sparkles, Check, AlertCircle } from "lucide-react";

interface ApplicationMatchBadgeProps {
  applicationId: string;
}

export function ApplicationMatchBadge({
  applicationId,
}: ApplicationMatchBadgeProps) {
  const { data: match, isLoading } = useApplicationMatchQuery(applicationId);

  if (isLoading) {
    return (
      <span className="text-[10px] text-muted-foreground font-mono">
        Analyzing...
      </span>
    );
  }

  if (!match) {
    return (
      <span className="text-[10px] text-muted-foreground font-mono">—</span>
    );
  }

  const { score, matchedSkills } = match;

  let badgeColor = "bg-secondary text-muted-foreground border-border";
  let icon = <Check className="size-2.5 text-muted-foreground" />;

  if (score >= 80) {
    badgeColor = "bg-emerald-950/40 text-emerald-400 border-emerald-800/40";
    icon = <Sparkles className="size-2.5 text-emerald-400" />;
  } else if (score >= 60) {
    badgeColor = "bg-indigo-950/40 text-indigo-400 border-indigo-800/40";
    icon = <Check className="size-2.5 text-indigo-400" />;
  } else if (score >= 40) {
    badgeColor = "bg-amber-950/40 text-amber-400 border-amber-800/40";
    icon = <AlertCircle className="size-2.5 text-amber-400" />;
  }

  return (
    <div
      className="flex items-center gap-1.5"
      title={`${matchedSkills.length} matching skills`}
    >
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border ${badgeColor}`}
      >
        {icon}
        <span>{score}% Fit</span>
      </span>
    </div>
  );
}

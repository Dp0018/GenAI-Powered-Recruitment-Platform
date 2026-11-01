"use client";

import React from "react";
import { useJobMatchQuery } from "../hooks/use-job-match";
import { Sparkles, Check, AlertCircle } from "lucide-react";

interface SkillsMatchBadgeProps {
  jobId: string;
}

export function SkillsMatchBadge({ jobId }: SkillsMatchBadgeProps) {
  const { data: match, isLoading } = useJobMatchQuery(jobId);

  if (isLoading || !match || match.score === 0) {
    return null;
  }

  const { score } = match;

  let colorClasses = "bg-secondary text-muted-foreground border-border";
  let icon = <Check className="size-3 text-muted-foreground" />;

  if (score >= 80) {
    colorClasses = "bg-emerald-950/50 text-emerald-400 border-emerald-800/50";
    icon = <Sparkles className="size-3 text-emerald-400" />;
  } else if (score >= 60) {
    colorClasses = "bg-indigo-950/50 text-indigo-400 border-indigo-800/50";
    icon = <Check className="size-3 text-indigo-400" />;
  } else if (score >= 40) {
    colorClasses = "bg-amber-950/40 text-amber-400 border-amber-800/40";
    icon = <AlertCircle className="size-3 text-amber-400" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border shadow-2xs ${colorClasses}`}
      title={`${match.matchedSkills.length} matched skills: ${match.summary}`}
    >
      {icon}
      <span>{score}% Match</span>
    </span>
  );
}

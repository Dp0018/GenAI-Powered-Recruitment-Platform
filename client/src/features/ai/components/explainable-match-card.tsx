"use client";

import React from "react";
import { ExplainableMatchResponse } from "../types/ai";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Award,
} from "lucide-react";

interface ExplainableMatchCardProps {
  data: ExplainableMatchResponse;
  candidateName?: string;
}

export function ExplainableMatchCard({ data, candidateName }: ExplainableMatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-primary border-primary/30 bg-primary/10";
    if (score >= 40) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-primary";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-4 text-foreground text-left">
      {/* Top Banner Card */}
      <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-secondary/40 via-secondary/20 to-secondary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`size-14 rounded-xl border flex flex-col items-center justify-center font-bold shrink-0 ${getScoreColor(
              data.overallScore
            )}`}
          >
            <span className="text-xl leading-none">{data.overallScore}%</span>
            <span className="text-[9px] font-mono tracking-tighter uppercase mt-0.5">
              {data.matchGrade}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-foreground">
                Explainable Fit Analysis {candidateName ? `for ${candidateName}` : ""}
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 font-medium">
                <Sparkles className="size-2.5 text-primary" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {data.executiveSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Technical Skills Factor */}
        <div className="p-3.5 rounded-lg border border-border bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Award className="size-3.5 text-primary" />
              <span>Core Skills Alignment (40%)</span>
            </span>
            <span className="font-mono font-bold text-foreground">
              {data.skillsScore ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                data.skillsScore ?? 0
              )}`}
              style={{ width: `${data.skillsScore ?? 0}%` }}
            />
          </div>
          {data.matchedSkills && data.matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {data.matchedSkills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Experience & Seniority Factor */}
        <div className="p-3.5 rounded-lg border border-border bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Briefcase className="size-3.5 text-primary" />
              <span>Experience & Seniority (25%)</span>
            </span>
            <span className="font-mono font-bold text-foreground">
              {data.experienceScore ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                data.experienceScore ?? 0
              )}`}
              style={{ width: `${data.experienceScore ?? 0}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1 font-mono">
            {data.experienceAssessment || "Evaluated against role requirements"}
          </p>
        </div>

        {/* Domain Fit */}
        <div className="p-3.5 rounded-lg border border-border bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-primary" />
              <span>Domain Alignment (20%)</span>
            </span>
            <span className="font-mono font-bold text-foreground">
              {data.domainScore ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                data.domainScore ?? 0
              )}`}
              style={{ width: `${data.domainScore ?? 0}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1 font-mono">
            {data.domainAssessment || "Industry & background evaluation"}
          </p>
        </div>

        {/* Workplace Fit */}
        <div className="p-3.5 rounded-lg border border-border bg-card/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Workplace & Location (15%)</span>
            </span>
            <span className="font-mono font-bold text-foreground">
              {data.workplaceScore ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                data.workplaceScore ?? 0
              )}`}
              style={{ width: `${data.workplaceScore ?? 0}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground pt-1 font-mono">
            Policy & timezone compatibility verified
          </p>
        </div>
      </div>

      {/* Key Strengths & Potential Gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Strengths */}
        <div className="p-4 rounded-lg border border-border bg-card space-y-2">
          <h5 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            <span>Key Match Strengths</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {data.keyStrengths && data.keyStrengths.length > 0 ? (
              data.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 text-xs mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] italic">Strong foundational qualifications match.</li>
            )}
          </ul>
        </div>

        {/* Areas for Growth / Gaps */}
        <div className="p-4 rounded-lg border border-border bg-card space-y-2">
          <h5 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="size-3.5" />
            <span>Target Growth Areas / Gaps</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {data.potentialGaps && data.potentialGaps.length > 0 ? (
              data.potentialGaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 text-xs mt-0.5">•</span>
                  <span>{gap}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] italic">No major disqualifying gaps identified.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Actionable Advice */}
      {data.candidateActionableAdvice && data.candidateActionableAdvice.length > 0 && (
        <div className="p-3.5 rounded-lg border border-border bg-secondary/30 space-y-1.5">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5 text-primary" />
            <span>Actionable Growth Advice</span>
          </span>
          <div className="space-y-1">
            {data.candidateActionableAdvice.map((adv, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">
                → {adv}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Fairness & Compliance Notice */}
      <div className="p-2.5 rounded border border-border/60 bg-secondary/10 text-[10px] text-muted-foreground font-mono flex items-center gap-2">
        <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
        <span>{data.biasAndFairnessNotice || "Evaluated objectively on verified technical skills, career achievements, and functional requirements."}</span>
      </div>
    </div>
  );
}

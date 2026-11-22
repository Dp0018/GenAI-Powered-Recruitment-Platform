"use client";

import React, { useState } from "react";
import { useOptimizeResumeBulletMutation } from "../hooks/use-rag";
import { ResumeOptimizeResponse } from "../types/rag";
import {
  Check,
  Copy,
  AlertCircle,
  TrendingUp,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SAMPLE_BULLETS = [
  "Responsible for writing backend APIs and fixing bugs in production.",
  "Helped improve database queries and worked with Redis caching.",
  "Worked with product team to launch new dashboard features.",
];

export function ResumeBulletOptimizer() {
  const [bulletText, setBulletText] = useState("");
  const [targetRole, setTargetRole] = useState("Senior Software Engineer");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const optimizeMutation = useOptimizeResumeBulletMutation();

  const handleOptimize = () => {
    if (!bulletText.trim()) return;
    optimizeMutation.mutate({
      bulletText: bulletText.trim(),
      targetRole: targetRole.trim(),
    });
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const data: ResumeOptimizeResponse | undefined = optimizeMutation.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 space-y-1">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-muted-foreground" />
          Resume Bullet-Point Impact Optimizer
        </h3>
        <p className="text-xs text-muted-foreground">
          Transform weak or passive resume bullets into quantifiable accomplishments using the Google XYZ formula:{" "}
          <span className="font-mono text-foreground/80">
            &ldquo;Accomplished [X] as measured by [Y], by doing [Z]&rdquo;
          </span>
        </p>
      </div>

      {/* Input controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Resume Bullet or Experience Description
            </label>
            <Textarea
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g. Responsible for maintaining Postgres database and writing microservices in Spring Boot..."
              rows={3}
              className="resize-none text-sm bg-background border-border"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Target Seniority / Role
            </label>
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="text-xs h-9 bg-background border-border"
            />
            <div className="pt-2">
              <Button
                onClick={handleOptimize}
                disabled={optimizeMutation.isPending || !bulletText.trim()}
                className="w-full h-9 text-xs gap-1.5"
              >
                {optimizeMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                <span>Analyze & Optimize</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-muted-foreground">Try example:</span>
          {SAMPLE_BULLETS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setBulletText(sample)}
              className="text-[11px] px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/50 text-left"
            >
              &ldquo;{sample.slice(0, 36)}...&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {data && (
        <div className="space-y-4 pt-2 border-t border-border">
          {/* Analysis Card */}
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Baseline Assessment
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {data.starFrameworkGrade}
                </Badge>
                <span className="text-xs font-mono font-medium">
                  Initial Score: {data.initialImpactScore}/100
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {data.critiqueAnalysis}
            </p>

            {data.identifiedWeaknesses && data.identifiedWeaknesses.length > 0 && (
              <div className="pt-1 space-y-1">
                {data.identifiedWeaknesses.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400"
                  >
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leveled High-Impact Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              High-Impact Leveled Rewrites (Google XYZ Formula)
            </h4>

            <div className="space-y-2.5">
              {data.optimizedOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-border bg-card space-y-2 hover:border-border/80 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {opt.level}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                        Projected Score: {opt.projectedImpactScore}/100
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(opt.bulletText, idx)}
                        className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-foreground font-mono leading-relaxed bg-muted/30 p-2.5 rounded border border-border/50">
                    &bull; {opt.bulletText}
                  </p>

                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="font-medium text-foreground/80">Metric Added:</span>
                    <span>{opt.metricsHighlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action Verbs */}
          {data.recommendedActionVerbs && data.recommendedActionVerbs.length > 0 && (
            <div className="p-3 rounded-lg border border-border bg-muted/20 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground whitespace-nowrap">
                Recommended Power Verbs:
              </span>
              <div className="flex flex-wrap gap-1">
                {data.recommendedActionVerbs.map((verb) => (
                  <span
                    key={verb}
                    className="px-2 py-0.5 rounded bg-background border border-border text-[11px] font-mono"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Loader2, UserCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useScorecardQuery,
  useAddScreeningNoteMutation,
} from "../hooks/use-screening-notes";

interface RecruiterScreeningScorecardProps {
  applicationId: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 - Poor",
  2: "2 - Fair",
  3: "3 - Good",
  4: "4 - Strong",
  5: "5 - Exceptional",
};

export function RecruiterScreeningScorecard({
  applicationId,
}: RecruiterScreeningScorecardProps) {
  const { data: scorecard, isLoading } = useScorecardQuery(applicationId);
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");

  const addNoteMutation = useAddScreeningNoteMutation(applicationId, () => {
    setNote("");
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    addNoteMutation.mutate({
      rating,
      note: note.trim(),
    });
  };

  const activeRating = hoverRating ?? rating;

  return (
    <div className="space-y-4">
      {/* Header with Average Rating & Confidentiality Badge */}
      <div className="p-3.5 rounded-lg bg-secondary/40 border border-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <UserCheck className="size-3.5 text-primary" />
            <span>Scorecard & Evaluation</span>
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="size-3" />
            Internal Only
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          {scorecard?.averageRating ? (
            <>
              <div className="flex items-center text-amber-400 text-lg font-bold">
                <Star className="size-4 fill-amber-400 mr-1" />
                <span>{scorecard.averageRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground font-normal ml-1">/ 5.0</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                ({scorecard.totalReviews} {scorecard.totalReviews === 1 ? "review" : "reviews"})
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground font-mono">
              No team evaluations recorded yet.
            </span>
          )}
        </div>
      </div>

      {/* Add New Note & Star Rating Form */}
      <form onSubmit={handleSubmit} className="p-3 rounded-lg border border-border bg-card/50 space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-muted-foreground">
            Rate Candidate
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isFilled = starVal <= activeRating;
              return (
                <button
                  type="button"
                  key={starVal}
                  onClick={() => setRating(starVal)}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  title={RATING_LABELS[starVal]}
                >
                  <Star
                    className={`size-4.5 ${
                      isFilled
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-mono text-muted-foreground ml-2">
              {RATING_LABELS[activeRating]}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-muted-foreground">
            Screening Notes
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add candidate strengths, culture fit, interview feedback..."
            rows={3}
            className="w-full text-xs rounded-md bg-secondary/40 border border-border p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary resize-none"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={addNoteMutation.isPending || !note.trim()}
            className="h-7 text-xs font-mono gap-1.5"
          >
            {addNoteMutation.isPending ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <MessageSquare className="size-3" />
                <span>Submit Evaluation</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Existing Notes Feed */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Evaluation History
        </h5>

        {isLoading ? (
          <div className="p-4 text-center">
            <Loader2 className="size-4 animate-spin text-primary mx-auto" />
          </div>
        ) : !scorecard?.notes?.length ? (
          <p className="text-xs text-muted-foreground/70 italic p-3 bg-secondary/20 rounded border border-dashed border-border text-center">
            Be the first team member to review this candidate.
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {scorecard.notes.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg border border-border bg-secondary/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {item.authorName}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${
                          i < item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {item.note}
                </p>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {new Date(item.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

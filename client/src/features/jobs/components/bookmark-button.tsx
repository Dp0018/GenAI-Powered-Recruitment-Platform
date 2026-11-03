"use client";

import React from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useIsJobSavedQuery, useToggleSaveJobMutation } from "../hooks/use-jobs";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  jobId: string;
  size?: "sm" | "default" | "icon";
  variant?: "outline" | "ghost";
  showText?: boolean;
  className?: string;
}

export function BookmarkButton({
  jobId,
  size = "icon",
  variant = "ghost",
  showText = false,
  className = "",
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const { data: isSaved } = useIsJobSavedQuery(jobId, Boolean(user));
  const toggleMutation = useToggleSaveJobMutation(jobId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMutation.mutate();
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={toggleMutation.isPending}
      onClick={handleClick}
      title={isSaved ? "Remove from saved jobs" : "Save this job"}
      className={`transition-colors cursor-pointer group ${
        isSaved
          ? "text-primary hover:text-primary/80"
          : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {toggleMutation.isPending ? (
        <Loader2 className="size-4 animate-spin text-primary" />
      ) : (
        <Bookmark
          className={`size-4 transition-transform group-hover:scale-110 ${
            isSaved ? "fill-primary text-primary" : "text-muted-foreground group-hover:text-primary"
          }`}
        />
      )}
      {showText && (
        <span className="text-xs font-mono ml-1.5">
          {isSaved ? "Saved" : "Save Job"}
        </span>
      )}
    </Button>
  );
}

"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JobEditorForm } from "@/features/jobs/components/job-editor-form";
import { useJobDetailQuery } from "@/features/jobs/hooks/use-jobs";
import { Loader2 } from "lucide-react";

function NewJobContent() {
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicateFrom");
  const { data: duplicateJob, isLoading } = useJobDetailQuery(duplicateId || "");

  if (duplicateId && isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-24 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">
          Loading template job to duplicate...
        </span>
      </div>
    );
  }

  return (
    <JobEditorForm
      mode="create"
      initialJob={
        duplicateJob
          ? {
              ...duplicateJob,
              title: `Copy of ${duplicateJob.title}`,
            }
          : null
      }
    />
  );
}

export default function NewJobPage() {
  return (
    <div className="flex-1 bg-background min-h-screen py-4">
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col items-center justify-center p-24 space-y-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground font-mono">
              Loading Job Editor...
            </span>
          </div>
        }
      >
        <NewJobContent />
      </Suspense>
    </div>
  );
}

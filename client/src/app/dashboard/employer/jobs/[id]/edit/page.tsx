"use client";

import React from "react";
import Link from "next/link";
import { JobEditorForm } from "@/features/jobs/components/job-editor-form";
import { useJobDetailQuery } from "@/features/jobs/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const { id } = React.use(params);
  const { data: job, isLoading, isError } = useJobDetailQuery(id);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-24 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">
          Loading job posting details...
        </span>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="w-full max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Job Posting Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested job could not be loaded or you may not have authorization to edit it.
        </p>
        <Link href="/dashboard/employer">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-mono">
            <ArrowLeft className="size-3.5" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background min-h-screen py-4">
      <JobEditorForm mode="edit" initialJob={job} jobId={job.id} />
    </div>
  );
}

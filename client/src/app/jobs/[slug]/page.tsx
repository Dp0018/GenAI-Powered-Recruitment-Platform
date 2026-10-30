import React from "react";
import { JobDetailView } from "@/features/jobs/components/job-detail-view";

interface JobPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata = {
  title: "Job Requisition - JobPortal",
  description: "View position specifications, compensation bands, and requirements.",
};

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  return (
    <div className="flex-1 flex flex-col bg-background">
      <JobDetailView slug={slug} />
    </div>
  );
}

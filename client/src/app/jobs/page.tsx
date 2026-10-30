import React from "react";
import { PublicJobsBoard } from "@/features/jobs/components/public-jobs-board";
import { Footer } from "@/components/shared/footer";

export const metadata = {
  title: "Explore Openings - JobPortal Requisition Board",
  description: "Browse verified engineering and leadership requisitions across companies.",
};

export default function JobsPage() {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <PublicJobsBoard />
      <Footer />
    </div>
  );
}

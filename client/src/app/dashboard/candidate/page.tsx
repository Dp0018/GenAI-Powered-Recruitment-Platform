import React from "react";
import { CandidateDashboardView } from "@/features/dashboard/candidate/components/candidate-dashboard-view";

export const metadata = {
  title: "Candidate Dashboard - JobPortal",
  description: "Candidate workspace for applications and status monitoring.",
};

export default function CandidateDashboardPage() {
  return <CandidateDashboardView />;
}

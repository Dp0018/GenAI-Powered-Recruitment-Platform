import React from "react";
import { EmployerDashboardView } from "@/features/dashboard/employer/components/employer-dashboard-view";

export const metadata = {
  title: "Employer Dashboard - JobPortal",
  description: "Employer workspace for job postings and candidate pipeline management.",
};

export default function EmployerDashboardPage() {
  return <EmployerDashboardView />;
}

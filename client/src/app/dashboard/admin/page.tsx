import React from "react";
import { AdminDashboardView } from "@/features/dashboard/admin/components/admin-dashboard-view";

export const metadata = {
  title: "Platform Admin Dashboard - JobPortal",
  description: "Governance control panel for tenant verification and compliance.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}

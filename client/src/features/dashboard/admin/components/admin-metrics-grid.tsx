"use client";

import React from "react";
import { useAdminAnalyticsQuery } from "@/features/admin/hooks/use-admin";
import {
  Users,
  Clock,
  Briefcase,
  FileText,
  Loader2,
} from "lucide-react";

export function AdminMetricsGrid() {
  const { data: analytics, isLoading } = useAdminAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-card/60 border border-border animate-pulse h-28 flex items-center justify-center"
          >
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  const pendingKYC = analytics?.pendingCompanies ?? 0;
  const verifiedTenants = analytics?.verifiedCompanies ?? 0;
  const totalUsers = analytics?.totalUsers ?? 0;
  const activeJobsCount = analytics?.activeJobs ?? 0;
  const totalApplications = analytics?.totalApplications ?? 0;
  const suspendedUsers = analytics?.bannedUsers ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Pending KYC card */}
      <div className="p-5 rounded-xl bg-card/70 border border-border space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span className="font-medium">KYC Verification Queue</span>
          <Clock className="size-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight flex items-baseline gap-2">
          <span>{pendingKYC}</span>
          {pendingKYC > 0 && (
            <span className="text-[11px] font-mono font-medium text-amber-400">
              Needs Review
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {verifiedTenants} authorized corporate entities
        </p>
      </div>

      {/* Active Jobs */}
      <div className="p-5 rounded-xl bg-card/70 border border-border space-y-2 group hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span className="font-medium">Live Job Openings</span>
          <Briefcase className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">
          {activeJobsCount}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {analytics?.totalJobs ?? 0} total listings created
        </p>
      </div>

      {/* Registered Users */}
      <div className="p-5 rounded-xl bg-card/70 border border-border space-y-2 group hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span className="font-medium">Platform Accounts</span>
          <Users className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight flex items-baseline gap-2">
          <span>{totalUsers}</span>
          {suspendedUsers > 0 && (
            <span className="text-[11px] font-mono text-rose-400">
              ({suspendedUsers} banned)
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground font-mono">
          {analytics?.totalCandidates ?? 0} Cand · {analytics?.totalEmployers ?? 0} Emp
        </p>
      </div>

      {/* Applications processed */}
      <div className="p-5 rounded-xl bg-card/70 border border-border space-y-2 group hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span className="font-medium">Total Applications</span>
          <FileText className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">
          {totalApplications}
        </div>
        <p className="text-[11px] text-muted-foreground font-mono">
          Direct applicant pipeline
        </p>
      </div>
    </div>
  );
}

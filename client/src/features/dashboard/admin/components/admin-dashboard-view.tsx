"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAdminAnalyticsQuery } from "@/features/admin/hooks/use-admin";
import { AdminMetricsGrid } from "./admin-metrics-grid";
import { AdminCompanyVerificationTab } from "./admin-company-verification-tab";
import { AdminUserModerationTab } from "./admin-user-moderation-tab";
import { AdminFraudQuarantineTab } from "./admin-fraud-quarantine-tab";
import { useQuarantinedJobsQuery } from "@/features/ai/hooks/use-ai";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  Users,
  Server,
  Database,
  Lock,
  Mail,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-[11px] font-mono text-secondary-foreground mb-1.5">
          <ShieldCheck className="size-3 text-primary" />
          <span>Platform Governance Control</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Administrative Operations Panel
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Welcome back, {user?.name || "Platform Admin"}. Review employer KYC
          credentials, enforce user compliance, and monitor system KPIs.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 shadow-xs">
          <CheckCircle2 className="size-3.5" />
          <span>Platform Status: Operational</span>
        </div>
      </div>
    </div>
  );
}

function AdminSystemHealthTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Infrastructure */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Server className="size-4 text-sky-400" />
              <span>Core Application Engine</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              OPERATIONAL
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">API Application Gateway</span>
              <span className="text-foreground font-medium">
                Online (Uptime: 99.98%)
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Frontend Delivery Network</span>
              <span className="text-foreground font-medium">
                Global Edge CDN Active
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Security & Access Control</span>
              <span className="text-foreground font-medium">
                Role-Based Access Enforced
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Session Expiration</span>
              <span className="text-foreground font-medium">
                Active Session Protection
              </span>
            </div>
          </div>
        </div>

        {/* Database & Integrations */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Database className="size-4 text-sky-400" />
              <span>Platform Cloud Services</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              SYNCHRONIZED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Database className="size-3.5 text-muted-foreground" />
                <span>Primary Database Storage</span>
              </span>
              <span className="text-emerald-400 font-medium">
                Healthy & Synchronized
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                <span>Transactional Email Dispatch</span>
              </span>
              <span className="text-emerald-400 font-medium">Service Connected</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="size-3.5 text-muted-foreground" />
                <span>Document & Media Storage</span>
              </span>
              <span className="text-emerald-400 font-medium">Cloud Storage Ready</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-muted-foreground" />
                <span>Audit & Activity Logging</span>
              </span>
              <span className="text-foreground font-medium">Real-Time Event Stream</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardView() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: analytics } = useAdminAnalyticsQuery();
  const { data: quarantinedData } = useQuarantinedJobsQuery(0, 1);
  const pendingKYC = analytics?.pendingCompanies ?? 0;
  const totalUsers = analytics?.totalUsers ?? 0;
  const quarantinedCount = quarantinedData?.totalElements ?? 0;

  if (isAuthLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">
          Verifying administrative access...
        </span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "PLATFORM_ADMIN") {
    return (
      <div className="flex-1 py-20 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="size-12 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          Administrative Access Restricted
        </h2>
        <p className="text-xs text-muted-foreground">
          Platform Governance requires authenticated{" "}
          <span className="font-mono text-primary">PLATFORM_ADMIN</span>{" "}
          credentials. You are currently logged in with insufficient
          permissions.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-mono text-xs"
            >
              Switch to Admin Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      <AdminHeader />
      <AdminMetricsGrid />

      <Tabs defaultValue="kyc" className="space-y-6">
        <div className="overflow-x-auto no-scrollbar pb-1">
          <TabsList className="inline-flex items-center gap-1.5 p-1.5 bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl h-13 min-h-[52px] shadow-xs">
            <TabsTrigger
              value="kyc"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <Building2 className="size-4" />
              <span>KYC Verification Queue</span>
              {pendingKYC > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {pendingKYC}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="quarantine"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <ShieldAlert className="size-4 text-rose-400" />
              <span>AI Trust & Quarantine</span>
              {quarantinedCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white shadow-xs">
                  {quarantinedCount}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="users"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <Users className="size-4" />
              <span>User Moderation</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-secondary/80 text-muted-foreground border border-border/60">
                {totalUsers}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="system"
              className="h-10 px-4 sm:px-5 rounded-xl text-sm font-medium gap-2.5 transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:border data-[state=active]:border-border/80 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 select-none whitespace-nowrap cursor-pointer"
            >
              <Server className="size-4" />
              <span>System Telemetry</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kyc" className="outline-none">
          <AdminCompanyVerificationTab />
        </TabsContent>

        <TabsContent value="quarantine" className="outline-none">
          <AdminFraudQuarantineTab />
        </TabsContent>

        <TabsContent value="users" className="outline-none">
          <AdminUserModerationTab />
        </TabsContent>

        <TabsContent value="system" className="outline-none">
          <AdminSystemHealthTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAdminAnalyticsQuery } from "@/features/admin/hooks/use-admin";
import { AdminMetricsGrid } from "./admin-metrics-grid";
import { AdminCompanyVerificationTab } from "./admin-company-verification-tab";
import { AdminUserModerationTab } from "./admin-user-moderation-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  Users,
  Activity,
  Server,
  Database,
  Lock,
  Mail,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
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
          Welcome back, {user?.name || "Platform Admin"}. Review employer KYC credentials, enforce user compliance, and monitor system KPIs.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-xs font-mono text-emerald-400">
          <Activity className="size-3" />
          <span>PostgreSQL Cluster: Healthy</span>
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
        <div className="p-6 rounded-xl border border-border bg-card/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Server className="size-4 text-primary" />
              <span>Core Application Engine</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              OPERATIONAL
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40 font-mono">
              <span className="text-muted-foreground">Framework Version</span>
              <span className="text-foreground">Spring Boot 3.4.x / Java 25</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40 font-mono">
              <span className="text-muted-foreground">Frontend Runtime</span>
              <span className="text-foreground">Next.js 16 (Turbopack SSR)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40 font-mono">
              <span className="text-muted-foreground">Security Layer</span>
              <span className="text-foreground">Stateless JWT + BCrypt (Role RBAC)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-muted-foreground">Access Token Expiry</span>
              <span className="text-foreground">15 Minutes (7-Day Refresh)</span>
            </div>
          </div>
        </div>

        {/* Database & Integrations */}
        <div className="p-6 rounded-xl border border-border bg-card/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Database className="size-4 text-primary" />
              <span>Database & External Services</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              SYNCHRONIZED
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40 font-mono">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Database className="size-3 text-muted-foreground" />
                <span>PostgreSQL Primary</span>
              </span>
              <span className="text-foreground font-medium">HikariCP Pool (Pool Size: 10)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40 font-mono">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3 text-muted-foreground" />
                <span>Resend Transactional</span>
              </span>
              <span className="text-emerald-400">REST API Connected</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40 font-mono">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="size-3 text-muted-foreground" />
                <span>ImageKit CDN Storage</span>
              </span>
              <span className="text-emerald-400">Secure Upload Ready</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Lock className="size-3 text-muted-foreground" />
                <span>Audit & Logging</span>
              </span>
              <span className="text-foreground">SLF4J Structured Logs</span>
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
  const pendingKYC = analytics?.pendingCompanies ?? 0;
  const totalUsers = analytics?.totalUsers ?? 0;

  if (isAuthLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">Verifying administrative access...</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "PLATFORM_ADMIN") {
    return (
      <div className="flex-1 py-20 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="size-12 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Administrative Access Restricted</h2>
        <p className="text-xs text-muted-foreground">
          Platform Governance requires authenticated <span className="font-mono text-primary">PLATFORM_ADMIN</span> credentials. You are currently logged in with insufficient permissions.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button size="sm" className="bg-primary text-primary-foreground font-mono text-xs">
              Switch to Admin Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
      <AdminHeader />
      <AdminMetricsGrid />

      <Tabs defaultValue="kyc" className="space-y-6">
        <TabsList className="bg-secondary/60 border border-border p-1 h-10 rounded-lg">
          <TabsTrigger
            value="kyc"
            className="text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <Building2 className="size-3.5" />
            <span>KYC Verification Queue</span>
            {pendingKYC > 0 && (
              <span className="size-2 rounded-full bg-amber-400 ml-0.5" />
            )}
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <Users className="size-3.5" />
            <span>User Moderation ({totalUsers})</span>
          </TabsTrigger>

          <TabsTrigger
            value="system"
            className="text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground"
          >
            <Server className="size-3.5" />
            <span>System Telemetry</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kyc" className="outline-none">
          <AdminCompanyVerificationTab />
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

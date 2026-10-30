"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
} from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-[11px] font-mono text-secondary-foreground mb-1.5">
          <ShieldCheck className="size-3 text-primary" />
          <span>Platform Governance</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Administrative Control Panel
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Monitor tenant compliance, review employer KYC credentials, and manage system operations.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary border border-border text-xs text-secondary-foreground">
          <Activity className="size-3 text-primary" />
          <span>PostgreSQL Pool: Healthy</span>
        </div>
      </div>
    </div>
  );
}

export function AdminMetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Pending Employer Verifications</span>
          <Clock className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">1</div>
        <p className="text-[11px] text-muted-foreground">Awaiting document and domain review</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Verified Employer Tenants</span>
          <Building2 className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">0</div>
        <p className="text-[11px] text-muted-foreground">Organizations authorized to publish</p>
      </div>

      <div className="p-5 rounded-lg bg-card/70 border border-border space-y-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Registered Platform Users</span>
          <Users className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground tracking-tight">2</div>
        <p className="text-[11px] text-muted-foreground">Candidates, Recruiters, and Admins</p>
      </div>
    </div>
  );
}

export function AdminPendingCompaniesTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Employer Verification Queue
        </h2>
        <span className="text-xs text-muted-foreground font-mono">1 Item Pending</span>
      </div>

      <div className="rounded-lg border border-border bg-card/60 overflow-hidden">
        <div className="p-4 border-b border-border/80 bg-secondary/30 grid grid-cols-12 text-xs font-medium text-muted-foreground">
          <div className="col-span-4">Company Entity</div>
          <div className="col-span-3">Industry / Size</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-border/60">
          <div className="p-4 grid grid-cols-12 items-center text-xs">
            <div className="col-span-4 space-y-0.5">
              <div className="font-semibold text-foreground">Acme Technologies Inc.</div>
              <div className="text-muted-foreground font-mono text-[11px]">acme.tech</div>
            </div>
            <div className="col-span-3 text-foreground/80">
              <div>Software & Technology</div>
              <div className="text-muted-foreground text-[11px]">11-50 employees</div>
            </div>
            <div className="col-span-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 text-amber-400 border border-amber-800/60">
                PENDING
              </span>
            </div>
            <div className="col-span-3 flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-border text-foreground hover:bg-secondary rounded-md gap-1"
                onClick={() => alert("Verification review APIs will be implemented in the Platform Admin KYC milestone.")}
              >
                <CheckCircle2 className="size-3 text-emerald-400" />
                <span>Verify</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-border text-muted-foreground hover:text-rose-400 hover:bg-rose-950/30 rounded-md gap-1"
                onClick={() => alert("Rejection flow will be implemented in the Platform Admin KYC milestone.")}
              >
                <XCircle className="size-3" />
                <span>Reject</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardView() {
  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      <AdminHeader />
      <AdminMetricsGrid />
      <AdminPendingCompaniesTable />
    </div>
  );
}

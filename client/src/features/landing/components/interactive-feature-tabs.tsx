"use client";

import React, { useState } from "react";
import {
  FileText,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Globe,
  SlidersHorizontal,
  Lock,
  RefreshCw,
  Terminal,
} from "lucide-react";

type TabId = "candidate-pipeline" | "employer-tenant" | "governance-audit";

interface TabDefinition {
  id: TabId;
  label: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  description: string;
}

const TABS: TabDefinition[] = [
  {
    id: "candidate-pipeline",
    label: "Candidate Pipeline",
    badge: "Lifecycle",
    icon: FileText,
    headline: "End-to-End Application Integrity with Cryptographic Audit Trails",
    description:
      "Candidates track application progression through strictly typed pipeline stages. Every status change generates an immutable timestamp and tenant verification record.",
  },
  {
    id: "employer-tenant",
    label: "Employer Tenant Hub",
    badge: "Multi-Tenant",
    icon: Building2,
    headline: "Isolated Workspaces with Scoped RBAC and Custom Requisition Bands",
    description:
      "Enterprise organizations configure custom compensation ranges, recruiter team access levels, and domain-bound candidate assessment funnels.",
  },
  {
    id: "governance-audit",
    label: "Platform KYC & Governance",
    badge: "Security",
    icon: ShieldCheck,
    headline: "DNS TXT Record Verification & Automated Employer Quarantine",
    description:
      "Unverified corporate tenants are held in quarantine until platform administrators confirm corporate domain ownership via DNS TXT records.",
  },
];

export function InteractiveFeatureTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("candidate-pipeline");

  // Candidate pipeline interactive demo state
  const [activeStep, setActiveStep] = useState<number>(2);

  // Employer tab interactive demo state
  const [minComp, setMinComp] = useState<number>(140);
  const [maxComp, setMaxComp] = useState<number>(190);
  const [recruiterRole, setRecruiterRole] = useState<"admin" | "recruiter" | "reviewer">("recruiter");

  // Governance tab interactive state
  const [dnsVerified, setDnsVerified] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleSimulateDnsCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setDnsVerified(true);
    }, 600);
  };

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-border/80 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold flex items-center gap-2">
              <SlidersHorizontal className="size-3.5" />
              <span>Interactive Workflow Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Engineered for Enterprise Talent Operations
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Experience the core operational surfaces powering candidate evaluation, tenant management, and platform compliance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tenant Engine: Online</span>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-5 rounded-xl text-left transition-all border flex flex-col justify-between gap-4 cursor-pointer ${
                  isSelected
                    ? "bg-card border-primary ring-1 ring-primary/30 shadow-md"
                    : "bg-card/40 border-border hover:bg-card/80 hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`size-9 rounded-md flex items-center justify-center ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded border ${
                      isSelected
                        ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                        : "bg-secondary border-border text-muted-foreground"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </div>
                <div>
                  <div
                    className={`text-base font-bold tracking-tight ${
                      isSelected ? "text-foreground" : "text-foreground/90"
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {tab.headline}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tab Showcase Canvas */}
        <div className="rounded-xl border border-border bg-card/70 p-6 sm:p-10 backdrop-blur-md space-y-8 shadow-xl">
          <div className="space-y-2 border-b border-border/60 pb-6">
            <div className="text-xs font-mono text-primary font-semibold uppercase tracking-wider">
              {currentTab.badge} Module Surface
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              {currentTab.headline}
            </h3>
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {currentTab.description}
            </p>
          </div>

          {/* Tab 1: Candidate Pipeline Stage Demo */}
          {activeTab === "candidate-pipeline" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                <span className="font-mono text-muted-foreground">
                  Verification Lifecycle: <strong className="text-foreground">Interactive Stage Inspector</strong>
                </span>
                <span className="font-mono text-muted-foreground">
                  Isolation: <strong className="text-primary">Tenant-Bound Security Filter</strong>
                </span>
              </div>

              {/* Progress Tracker */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  {
                    step: 1,
                    title: "Application Intake",
                    detail: "Credential Handshake",
                    status: "Completed",
                  },
                  {
                    step: 2,
                    title: "Domain Verification",
                    detail: "Identity OTP Clearance",
                    status: "Verified",
                  },
                  {
                    step: 3,
                    title: "Technical Review",
                    detail: "Panel Evaluation",
                    status: "In Progress",
                  },
                  {
                    step: 4,
                    title: "Decision & Clearance",
                    detail: "Tenant Authorization",
                    status: "Pending",
                  },
                ].map((item) => {
                  const isCurrent = activeStep === item.step;
                  const isDone = item.step < activeStep;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setActiveStep(item.step)}
                      className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary/20"
                          : isDone
                          ? "bg-card border-border text-foreground hover:border-border/80"
                          : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-muted-foreground font-semibold">
                          Stage 0{item.step}
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="size-4 text-primary" />
                        ) : isCurrent ? (
                          <Clock className="size-4 text-primary animate-pulse" />
                        ) : (
                          <span className="size-2 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <div className="text-sm font-bold text-foreground leading-snug">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.detail}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detail Inspector Card */}
              <div className="rounded-lg border border-border bg-secondary/40 p-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between text-muted-foreground border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-primary" />
                    <span className="text-foreground font-semibold text-sm">Stage Audit Trail Metadata</span>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded font-mono">
                    Audit Log Signed
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Session Cryptographic State</div>
                    <div className="text-foreground font-semibold">HMAC-SHA256 Token Validated</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Tenant Partition Key</div>
                    <div className="text-foreground font-semibold">Scoped Tenant Isolation</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Active Lifecycle Status</div>
                    <div className="text-primary font-bold">
                      {activeStep === 1
                        ? "Stage 01: Application Submitted & Encrypted"
                        : activeStep === 2
                        ? "Stage 02: Candidate Identity Confirmed via OTP"
                        : activeStep === 3
                        ? "Stage 03: Hiring Panel Technical Review"
                        : "Stage 04: Executive Decision & Offer Dispatch"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Employer Tenant Hub Demo */}
          {activeTab === "employer-tenant" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Configuration Pane */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">
                      Base Salary Range Policy Bounds (USD k/yr)
                    </label>
                    <span className="font-mono text-sm text-primary font-bold">
                      ${minComp}k - ${maxComp}k USD
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mb-1 block">
                        Minimum ($k)
                      </span>
                      <input
                        type="range"
                        min={100}
                        max={180}
                        step={5}
                        value={minComp}
                        onChange={(e) => setMinComp(Number(e.target.value))}
                        className="w-full accent-primary bg-secondary rounded-lg h-2 cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-muted-foreground mb-1 block">
                        Maximum ($k)
                      </span>
                      <input
                        type="range"
                        min={180}
                        max={280}
                        step={5}
                        value={maxComp}
                        onChange={(e) => setMaxComp(Number(e.target.value))}
                        className="w-full accent-primary bg-secondary rounded-lg h-2 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground block">
                    Assigned Hiring Role Scope (RBAC)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { role: "admin", label: "Employer Admin", desc: "Full tenant administration" },
                      { role: "recruiter", label: "Recruiter", desc: "Manage openings & reviews" },
                      { role: "reviewer", label: "Interviewer", desc: "Read & feedback access" },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setRecruiterRole(item.role as typeof recruiterRole)}
                        className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                          recruiterRole === item.role
                            ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary/20"
                            : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <div className="text-sm font-bold">{item.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Live Preview Card */}
              <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-4 shadow-md">
                <div className="flex items-center justify-between text-sm border-b border-border pb-3">
                  <span className="font-bold text-foreground">Configured Tenant Policy</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Active Policy
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-mono text-primary font-semibold uppercase tracking-wider">
                    Role Scope: {recruiterRole.toUpperCase()}
                  </div>
                  <h4 className="text-base font-bold text-foreground">Enterprise Requisition Schema</h4>
                  <div className="text-sm text-muted-foreground">
                    Enforced Compensation Bounds:{" "}
                    <strong className="text-foreground font-mono">
                      ${minComp},000 - ${maxComp},000 USD
                    </strong>
                  </div>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Scope: {recruiterRole.toUpperCase()}</span>
                  <span className="text-primary font-semibold">Tenant Partition: Enforced</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Governance & Platform KYC Audit */}
          {activeTab === "governance-audit" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Domain TXT Record status */}
                <div className="p-6 rounded-xl border border-border bg-secondary/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Globe className="size-4 text-primary" />
                      <span>DNS TXT Ownership Record</span>
                    </div>
                    {dnsVerified ? (
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" />
                        <span>Propagated</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                        Pending DNS
                      </span>
                    )}
                  </div>
                  <div className="p-3 rounded-md bg-background border border-border font-mono text-xs text-muted-foreground overflow-x-auto">
                    <code>_jobportal-challenge.yourcompany.com IN TXT &quot;jp-verify=99f2b8a7c1e3&quot;</code>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateDnsCheck}
                    disabled={isVerifying}
                    className="text-xs text-primary hover:text-primary/80 font-mono inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`size-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                    <span>{isVerifying ? "Querying Nameservers..." : "Re-query Nameserver Records"}</span>
                  </button>
                </div>

                {/* Tenant Quarantine & Approval */}
                <div className="p-6 rounded-xl border border-border bg-secondary/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <ShieldCheck className="size-4 text-primary" />
                      <span>Platform KYC Clearance Status</span>
                    </div>
                    <span className="text-xs font-mono text-foreground bg-primary/10 border border-primary/30 px-2.5 py-0.5 rounded font-semibold">
                      Admin Verified
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground font-mono">
                    <div className="flex justify-between">
                      <span>Corporate Entity Check:</span>
                      <strong className="text-foreground">Legitimate Commercial Entity</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Root Admin Identity:</span>
                      <strong className="text-foreground">6-Digit OTP Confirmed</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tenant State:</span>
                      <strong className="text-emerald-400">Active (Quarantine Cleared)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

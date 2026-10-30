import React from "react";
import Link from "next/link";
import { Briefcase, ShieldCheck, Lock, Layers } from "lucide-react";
import { GuestOnlyGuard } from "@/features/auth/components/guest-only-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] overflow-hidden flex flex-col lg:grid lg:grid-cols-12 bg-background relative">
      {/* Precision Architectural Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      {/* Left Column: Platform Security & Value Proposition (Desktop) */}
      <aside className="hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col justify-between p-8 xl:p-12 border-r border-border/80 bg-card/40 relative z-10 h-full overflow-hidden">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Briefcase className="size-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-foreground">
                JobPortal
              </div>
              <div className="text-xs text-muted-foreground">
                Recruitment Infrastructure
              </div>
            </div>
          </Link>

          {/* Value Points */}
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground leading-snug">
                Unified Hiring Infrastructure with Scoped Access Control.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect directly with verified corporate entities. Every session and requisition operates within strictly isolated tenant partitions.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/60">
              <div className="flex items-start gap-3">
                <div className="size-7 rounded bg-secondary flex items-center justify-center text-primary shrink-0 mt-0.5 border border-border">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Verified Company Domains
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Zero unverified employers. Corporate accounts undergo rigorous administrative review and domain records validation.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-7 rounded bg-secondary flex items-center justify-center text-primary shrink-0 mt-0.5 border border-border">
                  <Layers className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Scoped Role Segregation
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Automated access scopes isolate Candidate, Employer Admin, Recruiter, and Platform Admin capabilities.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-7 rounded bg-secondary flex items-center justify-center text-primary shrink-0 mt-0.5 border border-border">
                  <Lock className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Two-Factor Identity Protection
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Account access and registration are safeguarded with transactional 6-digit email verification passcodes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Compliance Status Chip (No internal framework mentions) */}
        <div className="p-3.5 rounded-lg bg-secondary/50 border border-border text-xs space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground font-semibold">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Security Assurance</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Tenant Isolation: Enforced</span>
            <span>Data Encryption: AES-256</span>
          </div>
        </div>
      </aside>

      {/* Right Column: Active Auth Form (Fit height, no window scroll) */}
      <main className="flex-1 lg:col-span-7 xl:col-span-7 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-lg my-auto py-2">
          <GuestOnlyGuard>{children}</GuestOnlyGuard>
        </div>
      </main>
    </div>
  );
}

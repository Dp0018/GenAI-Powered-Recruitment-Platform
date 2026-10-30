import React from "react";
import { ShieldCheck, Layers, Lock } from "lucide-react";

export function ArchitecturePillars() {
  return (
    <section id="security" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-border/80 bg-background">
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
            Security & Governance
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Built for Enterprise Privacy, Compliance, and Data Isolation
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Every hiring organization operates within an isolated tenant boundary with strict identity governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-xl bg-card/70 border border-border space-y-4 hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Mandatory Employer Verification
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All company accounts undergo administrative review and corporate domain validation before receiving publication privileges.
            </p>
          </div>

          <div className="p-7 rounded-xl bg-card/70 border border-border space-y-4 hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Layers className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Role-Based Access Control
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dedicated permission boundaries for Candidates, Hiring Managers, Recruiters, and Platform Administrators to prevent unauthorized access.
            </p>
          </div>

          <div className="p-7 rounded-xl bg-card/70 border border-border space-y-4 hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Lock className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Two-Factor Identity Protection
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cryptographic session security paired with 6-digit one-time password challenges delivered directly to authorized email inboxes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

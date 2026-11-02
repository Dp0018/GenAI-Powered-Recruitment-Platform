"use client";

import React from "react";
import { Building2, Sparkles } from "lucide-react";

const COMPANIES = [
  { name: "Stripe", domain: "Fintech & Payments", tag: "Hiring 18+ roles" },
  { name: "Vercel", domain: "Frontend Cloud", tag: "Hiring 12+ roles" },
  { name: "Figma", domain: "Design Infrastructure", tag: "Hiring 9+ roles" },
  { name: "Supabase", domain: "Open Source Backend", tag: "Hiring 15+ roles" },
  { name: "Linear", domain: "Issue Tracking", tag: "Hiring 6+ roles" },
  { name: "OpenAI", domain: "Applied AI", tag: "Hiring 24+ roles" },
  { name: "Datadog", domain: "Observability", tag: "Hiring 30+ roles" },
  { name: "Retool", domain: "Internal Tooling", tag: "Hiring 11+ roles" },
];

export function TrustedCompaniesMarquee() {
  return (
    <section className="py-12 border-b border-border/60 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <Sparkles className="size-3 text-primary" />
          <span>Top Tech Leaders & High-Growth Scaleups Hire On JobPortal</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 items-center">
          {COMPANIES.map((company) => (
            <div
              key={company.name}
              className="p-3 rounded-lg border border-border/80 bg-card/60 hover:border-primary/40 hover:bg-card transition-all text-center group cursor-default"
            >
              <div className="font-bold text-sm sm:text-base text-foreground/80 group-hover:text-primary transition-colors">
                {company.name}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono truncate">
                {company.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

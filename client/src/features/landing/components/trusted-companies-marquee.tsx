"use client";

import React from "react";

const COMPANIES = [
  { name: "Stripe", tag: "18 open roles" },
  { name: "Vercel", tag: "12 open roles" },
  { name: "Figma", tag: "9 open roles" },
  { name: "Supabase", tag: "15 open roles" },
  { name: "Linear", tag: "6 open roles" },
  { name: "OpenAI", tag: "24 open roles" },
  { name: "Datadog", tag: "30 open roles" },
  { name: "Retool", tag: "11 open roles" },
];

export function TrustedCompaniesMarquee() {
  return (
    <section className="py-10 border-b border-border/60 bg-secondary/10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Hiring teams from top companies hire on JobPortal
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 items-center">
          {COMPANIES.map((company) => (
            <div
              key={company.name}
              className="p-3 rounded-lg border border-border/60 bg-card/60 text-center cursor-default"
            >
              <div className="font-semibold text-sm text-foreground">
                {company.name}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {company.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

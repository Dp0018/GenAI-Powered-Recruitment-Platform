"use client";

import React from "react";
import {
  Coins,
  Zap,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  FileCheck2,
} from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Coins,
    title: "100% Upfront Pay Transparency",
    description:
      "Every single role specifies real base salary, equity options, and sign-on bonuses. No more wasting 4 interview rounds to discover below-market compensation.",
    badge: "Transparent Compensation",
  },
  {
    icon: Zap,
    title: "1-Click Direct Application",
    description:
      "Apply in seconds using your profile or saved resume library. Skip cumbersome 15-page external ATS forms and duplicate resume uploads.",
    badge: "Fast-Track",
  },
  {
    icon: Sparkles,
    title: "AI Profile Fit & Resume Scanner",
    description:
      "Check your percentage fit against any role before submitting. Identify skill gaps and get tailored suggestions to boost your interview chances.",
    badge: "AI Powered",
  },
  {
    icon: ShieldCheck,
    title: "Zero Ghost Jobs or Scams",
    description:
      "Every company undergoes strict verification. Our AI Fraud Guardian flags suspicious requisitions, upfront fee scams, and stale listings.",
    badge: "Verified Trust",
  },
  {
    icon: CalendarCheck,
    title: "Instant Self-Serve Interviews",
    description:
      "Choose from available hiring manager calendar slots directly on the platform with automated ICS calendar invites. No scheduling back-and-forth.",
    badge: "Frictionless",
  },
  {
    icon: FileCheck2,
    title: "Digital Job Offer Acceptance",
    description:
      "Review compensation breakdowns, equity terms, and start dates in a structured offer letter, then sign digitally with legally compliant records.",
    badge: "Full Lifecycle",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-background">
      <div className="container mx-auto max-w-6xl space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            <span>Built For Modern Hiring</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Why Job Seekers and Top Teams Love JobPortal
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We redesigned the hiring experience from the ground up to eliminate the friction, ghosting, and secrecy of legacy job boards.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {VALUE_PROPS.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.title}
                className="p-7 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded font-medium">
                      {prop.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {prop.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

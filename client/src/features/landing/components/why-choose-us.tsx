"use client";

import React from "react";
import {
  PoundSterling,
  Zap,
  ShieldCheck,
  CalendarCheck,
  FileCheck2,
  Users,
} from "lucide-react";

const VALUE_PROPS = [
  {
    icon: PoundSterling,
    title: "Upfront Salary Transparency",
    description:
      "Every position lists base salary ranges, equity options, and bonuses so you know the full compensation before applying.",
  },
  {
    icon: Zap,
    title: "Direct One-Click Apply",
    description:
      "Apply directly using your saved profile or resume. No tedious external forms or repetitive data entry.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Companies Only",
    description:
      "Every hiring organization is reviewed and verified. We filter out fake job postings, scam recruiters, and ghost listings.",
  },
  {
    icon: CalendarCheck,
    title: "Simple Interview Scheduling",
    description:
      "Select available interview slots directly from the recruiter's calendar without long back-and-forth email chains.",
  },
  {
    icon: Users,
    title: "Real Recruiter Communication",
    description:
      "Connect directly with hiring managers and team members rather than getting lost in automated screening systems.",
  },
  {
    icon: FileCheck2,
    title: "Digital Offer Letters",
    description:
      "Receive detailed offer letters with verified terms and complete digital signing directly within the portal.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-background">
      <div className="mx-auto w-full max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Better Hiring
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            A simpler, more transparent job search
          </h2>
          <p className="text-sm text-muted-foreground">
            Built to take the frustration and secrecy out of finding your next position.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUE_PROPS.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.title}
                className="p-6 rounded-xl bg-card border border-border/80 space-y-3"
              >
                <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                  <Icon className="size-5" />
                </div>

                <h3 className="font-semibold text-base text-foreground">
                  {prop.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

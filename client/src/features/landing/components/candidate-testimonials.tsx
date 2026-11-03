"use client";

import React from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Senior Full Stack Engineer",
    hiredAt: "Hired at Stripe",
    compensation: "£145k / yr + Equity",
    quote:
      "I applied directly on a Tuesday, had my first call on Thursday, and accepted an offer two weeks later. The upfront salary transparency meant zero awkward negotiation surprises.",
    rating: 5,
    avatarInitials: "SJ",
  },
  {
    name: "Alex Rivera",
    role: "Staff Platform Engineer",
    hiredAt: "Hired at Vercel",
    compensation: "£165k / yr + Stock",
    quote:
      "Unlike legacy boards with agency spam and ghost listings, every company on JobPortal was verified and the hiring manager directly reviewed my application.",
    rating: 5,
    avatarInitials: "AR",
  },
  {
    name: "Priya Sharma",
    role: "Lead Product Designer",
    hiredAt: "Hired at Figma",
    compensation: "£135k / yr + Equity",
    quote:
      "The application process was refreshingly simple. I submitted using my saved profile and scheduled my interviews right from the recruiter's calendar.",
    rating: 5,
    avatarInitials: "PS",
  },
];

export function CandidateTestimonials() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-background">
      <div className="mx-auto w-full max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Trusted by candidates hired at top companies
          </h2>
          <p className="text-sm text-muted-foreground">
            Real feedback from professionals who found their roles on JobPortal.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-xl bg-card border border-border/80 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-center gap-3">
                <div className="size-9 rounded-full bg-secondary text-foreground flex items-center justify-center font-medium text-xs shrink-0">
                  {t.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-foreground truncate">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.role}</div>
                  <div className="text-[11px] text-primary truncate font-medium">
                    {t.hiredAt} • {t.compensation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

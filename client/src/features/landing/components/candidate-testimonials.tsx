"use client";

import React from "react";
import { Star, CheckCircle2, Quote, Sparkles } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Senior Full Stack Engineer",
    hiredAt: "Hired at Stripe",
    compensation: "$185,000 / yr + Equity",
    quote:
      "I applied with 1-click on a Tuesday, had my first call on Thursday, and accepted my offer two weeks later. The upfront salary transparency meant zero awkward negotiation surprises.",
    rating: 5,
    avatarInitials: "SJ",
  },
  {
    name: "Alex Rivera",
    role: "Staff Platform Engineer",
    hiredAt: "Hired at Vercel",
    compensation: "$215,000 / yr + Stock",
    quote:
      "Legacy job boards are filled with recruiter agencies and stale ghost listings. On JobPortal, every company was verified and the hiring manager directly reviewed my application.",
    rating: 5,
    avatarInitials: "AR",
  },
  {
    name: "Priya Sharma",
    role: "Lead Product Designer",
    hiredAt: "Hired at Figma",
    compensation: "$175,000 / yr + Equity",
    quote:
      "The AI profile fit breakdown was so insightful. It showed me exactly which design systems in my portfolio aligned with the job description before I submitted my application.",
    rating: 5,
    avatarInitials: "PS",
  },
];

export function CandidateTestimonials() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-background">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Loved by Thousands of Hired Engineers & Leaders
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            See how top candidates found their dream roles and accelerated their career growth.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-7 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="size-5 text-muted-foreground/40" />
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center gap-3">
                <div className="size-11 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono text-sm shrink-0">
                  {t.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-foreground truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.role}</div>
                  <div className="text-[11px] font-mono text-emerald-400 font-medium truncate pt-0.5">
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

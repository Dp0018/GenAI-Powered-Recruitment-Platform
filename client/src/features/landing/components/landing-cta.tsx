"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-5xl">
        <div className="p-8 sm:p-14 rounded-3xl bg-radial-[at_center] from-primary/20 via-card to-card border border-primary/30 shadow-2xl relative overflow-hidden text-center space-y-8">
          {/* Decorative ambient elements */}
          <div className="absolute -top-24 -left-24 size-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 size-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary font-semibold">
              <Sparkles className="size-3.5" />
              <span>Join 50,000+ Professionals</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Ready to Accelerate Your Career?
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Create your verified profile in 60 seconds. Get discovered by top engineering and product teams without the spam.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-xl gap-2 shadow-lg shadow-primary/25"
              >
                <span>Find Your Next Job</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link href="/register/employer" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 border-border text-foreground hover:bg-secondary font-semibold text-sm rounded-xl gap-2"
              >
                <span>Hire Elite Talent</span>
              </Button>
            </Link>
          </div>

          <div className="relative pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              100% Free for candidates
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Verified companies only
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-emerald-500" />
              Fast-track responses
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

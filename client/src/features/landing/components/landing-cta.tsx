"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="p-8 sm:p-14 rounded-2xl bg-card border border-border/80 shadow-sm text-center space-y-8">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-medium text-primary uppercase tracking-wider">
              Get Started Today
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Ready to find your next opportunity?
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Create your profile in minutes. Connect directly with hiring teams at verified companies with complete salary transparency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-11 px-7 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-lg gap-2"
              >
                <span>Find Jobs</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link href="/register/employer" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 px-7 border-border text-foreground hover:bg-secondary font-medium text-sm rounded-lg"
              >
                <span>Post a Job as Employer</span>
              </Button>
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-primary" />
              Free for candidates
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-primary" />
              Verified companies only
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-primary" />
              No recruiter spam
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

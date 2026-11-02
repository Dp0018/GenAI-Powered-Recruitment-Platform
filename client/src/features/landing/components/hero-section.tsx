"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Layers,
  Terminal,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 pt-20 pb-20 sm:pt-28 sm:pb-28 px-4 sm:px-6 lg:px-8">
      {/* Precision Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Atmospheric Top Steel-Blue Glow */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[60rem] h-[28rem] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_70%)] blur-3xl" />

      <div className="container relative mx-auto max-w-5xl text-center space-y-8">
        {/* Verification Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-md bg-secondary/80 border border-border text-xs font-mono text-muted-foreground backdrop-blur-md shadow-sm">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground font-semibold">Verified Employers</span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-primary" />
            Direct Hiring
          </span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
            Find Your Dream Job,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500">
              Apply in Seconds.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified companies, discover opportunities tailored to your skills, and apply with 1-click quick apply.
          </p>
        </div>

        {/* Primary Action Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md text-sm gap-2 transition-all shadow-md shadow-primary/25 border border-primary/30"
            >
              <span>Join as Candidate</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <Link href="/register/employer" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 border-border bg-card/70 text-foreground hover:bg-secondary font-medium rounded-md text-sm gap-2 transition-all backdrop-blur-sm"
            >
              <Building2 className="size-4 text-primary" />
              <span>Register Company Entity</span>
            </Button>
          </Link>
        </div>

        {/* Technical Architecture Guarantees */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-lg bg-card/60 border border-border space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <ShieldCheck className="size-4 text-primary" />
                <span>Domain Verification</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All employer accounts require corporate verification and administrative clearance before publishing requisitions.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-card/60 border border-border space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Layers className="size-4 text-primary" />
                <span>4-Role Strict RBAC</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Access tokens encode distinct scopes for Candidates, Employer Admins, Recruiters, and Platform Admins.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-card/60 border border-border space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Lock className="size-4 text-primary" />
                <span>Cryptographic OTP</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Account authentication is protected with transactional 6-digit email verification challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

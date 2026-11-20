"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useBilling } from "@/features/billing/hooks/use-billing";
import { Button } from "@/components/ui/button";
import {
  Check,
  Building2,
  User,
  CreditCard,
  Crown,
  HelpCircle,
} from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    subscription,
    checkoutEmployer,
    isCheckingOutEmployer,
    checkoutCandidate,
    isCheckingOutCandidate,
    openCustomerPortal,
    isOpenPortalLoading,
  } = useBilling();

  const isEmployerRole =
    user?.role === "EMPLOYER_ADMIN" || user?.role === "RECRUITER";
  const [activeTab, setActiveTab] = useState<"employers" | "candidates">(
    isEmployerRole ? "employers" : "employers"
  );

  const recruiterGrowthPriceId =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_RECRUITER_GROWTH ||
    "price_1UYJoq4zktYRu2zyPac0d1J9";
  const recruiterEnterprisePriceId =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_RECRUITER_ENTERPRISE ||
    "price_1UYJqo4zktYRu2zyOdbRTtOy";
  const candidateProPriceId =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_CANDIDATE_PRO ||
    "price_1UYJsD4zktYRu2zyT8FWy1K7";

  const handleEmployerSelect = (priceId: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }
    if (!isEmployerRole) {
      router.push("/register/employer");
      return;
    }
    checkoutEmployer(priceId);
  };

  const handleCandidateSelect = (priceId: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }
    checkoutCandidate(priceId);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary border border-border text-xs text-muted-foreground font-mono">
            <span>Pricing plans</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Clear pricing for candidates and hiring teams
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Verified hiring with upfront salary disclosures. Transparent monthly billing in GBP (£).
          </p>

          {/* Active Plan Indicator for Logged In Users */}
          {isAuthenticated && subscription && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs">
                <span className="text-muted-foreground">Current plan:</span>
                <span className="font-medium text-foreground">
                  {subscription.planType}
                </span>
                <span className="text-border">•</span>
                <span className="text-muted-foreground">
                  Status: <span className="text-foreground font-medium">{subscription.status.toLowerCase()}</span>
                </span>
                {subscription.customerId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-[11px] gap-1.5 ml-2 cursor-pointer rounded-md"
                    onClick={() => openCustomerPortal()}
                    disabled={isOpenPortalLoading}
                  >
                    <CreditCard className="size-3 text-muted-foreground" />
                    <span>Manage billing</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Role Switcher Tabs */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex p-1 rounded-lg bg-secondary border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("employers")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "employers"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="size-4 text-muted-foreground" />
                <span>For employers</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("candidates")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "candidates"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="size-4 text-muted-foreground" />
                <span>For candidates</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EMPLOYER PRICING TIERS */}
        {/* ========================================================================= */}
        {activeTab === "employers" && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Starter Tier */}
            <div className="rounded-xl bg-card border border-border p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Starter</h3>
                  <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-medium text-muted-foreground">
                    Free
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  For early teams testing verified job postings.
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">£0</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>1 active job requisition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Applicant tracking (ATS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>2 custom screening questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Direct candidate messaging</span>
                  </li>
                </ul>
              </div>

              <div>
                {isEmployerRole && subscription?.planType === "FREE" ? (
                  <Button variant="outline" className="w-full h-9 rounded-md text-xs" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-9 rounded-md text-xs cursor-pointer hover:bg-secondary"
                    onClick={() => router.push(isAuthenticated ? "/dashboard/employer" : "/register/employer")}
                  >
                    Start free
                  </Button>
                )}
              </div>
            </div>

            {/* 2. Growth Tier (Highlighted) */}
            <div className="rounded-xl bg-card border border-primary/50 p-6 flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-2.5 left-6 px-2 py-0.5 rounded bg-primary text-[10px] font-medium text-primary-foreground">
                Most popular
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Growth</h3>
                  <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-medium text-foreground">
                    Recruiter Pro
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  For growing teams actively hiring engineers.
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">£59</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground/90 pt-2 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Up to 5 active job requisitions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>AI candidate fit breakdowns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Unlimited screening questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Candidate profile bookmarks & tags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Priority email support</span>
                  </li>
                </ul>
              </div>

              <div>
                {isEmployerRole && subscription?.planType === "GROWTH" ? (
                  <Button variant="outline" className="w-full h-9 rounded-md text-xs" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    className="w-full h-9 rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
                    onClick={() => handleEmployerSelect(recruiterGrowthPriceId)}
                    disabled={isCheckingOutEmployer}
                  >
                    {isCheckingOutEmployer ? "Connecting to Stripe..." : "Upgrade to Growth (£59/mo)"}
                  </Button>
                )}
              </div>
            </div>

            {/* 3. Enterprise Tier */}
            <div className="rounded-xl bg-card border border-border p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Enterprise</h3>
                  <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-medium text-muted-foreground">
                    Custom scale
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  For tech organizations with continuous hiring needs.
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">£299</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Unlimited active job requisitions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>AI trust and fraud verification scan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Featured job spotlight pinning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Multi-seat recruiter team access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Dedicated channel and 99.9% SLA</span>
                  </li>
                </ul>
              </div>

              <div>
                {isEmployerRole && subscription?.planType === "ENTERPRISE" ? (
                  <Button variant="outline" className="w-full h-9 rounded-md text-xs" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-9 rounded-md text-xs hover:bg-secondary cursor-pointer"
                    onClick={() => handleEmployerSelect(recruiterEnterprisePriceId)}
                    disabled={isCheckingOutEmployer}
                  >
                    {isCheckingOutEmployer ? "Connecting to Stripe..." : "Upgrade to Enterprise (£299/mo)"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CANDIDATE PRICING TIERS */}
        {/* ========================================================================= */}
        {activeTab === "candidates" && (
          <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Standard Free Candidate */}
            <div className="rounded-xl bg-card border border-border p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Standard</h3>
                  <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-medium text-muted-foreground">
                    Free
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Everything required to apply, interview, and accept offers.
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">£0</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Unlimited job applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Store up to 2 resumes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Candidate profile portfolio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Up to 3 active search alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-foreground shrink-0" />
                    <span>Digital offer review and signing</span>
                  </li>
                </ul>
              </div>

              <div>
                {subscription?.planType === "FREE" && !isEmployerRole ? (
                  <Button variant="outline" className="w-full h-9 rounded-md text-xs" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-9 rounded-md text-xs hover:bg-secondary cursor-pointer"
                    onClick={() => router.push(isAuthenticated ? "/jobs" : "/register/candidate")}
                  >
                    Start applying free
                  </Button>
                )}
              </div>
            </div>

            {/* 2. Candidate Pro */}
            <div className="rounded-xl bg-card border border-primary/50 p-6 flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-2.5 left-6 px-2 py-0.5 rounded bg-primary text-[10px] font-medium text-primary-foreground flex items-center gap-1">
                <Crown className="size-3" />
                <span>Pro tier</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Candidate Pro</h3>
                  <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-medium text-foreground">
                    Fast-track
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pre-screen matches against verified roles and get direct recruiter visibility.
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">£29</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground/90 pt-2 border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>AI resume match score pre-forecast</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Spotlight badge (pinned 48h to recruiter inbox)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Store up to 10 specialized resumes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Applicant pool percentile and salary insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Instant real-time job alert push notifications</span>
                  </li>
                </ul>
              </div>

              <div>
                {subscription?.planType === "PRO" ? (
                  <Button variant="outline" className="w-full h-9 rounded-md text-xs" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    className="w-full h-9 rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
                    onClick={() => handleCandidateSelect(candidateProPriceId)}
                    disabled={isCheckingOutCandidate}
                  >
                    {isCheckingOutCandidate ? "Connecting to Stripe..." : "Upgrade to Pro (£29/mo)"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FAQ SECTION */}
        {/* ========================================================================= */}
        <div className="mt-20 max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct answers on billing, quotas, and cancellations.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-card border border-border space-y-1.5">
              <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
                <HelpCircle className="size-3.5 text-muted-foreground" />
                <span>Can I cancel my subscription at any time?</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">
                Yes. You can cancel from the billing portal. Plan access stays active through the end of your current 30-day billing cycle.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border space-y-1.5">
              <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
                <HelpCircle className="size-3.5 text-muted-foreground" />
                <span>How are employer job posting quotas enforced?</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">
                Quotas count published postings. If you reach your limit (1 for Starter, 5 for Growth), you can archive or close an older posting to publish a new one, or upgrade to Enterprise for unlimited positions.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border space-y-1.5">
              <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
                <HelpCircle className="size-3.5 text-muted-foreground" />
                <span>How are payments processed?</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">
                All checkout and payment methods are handled directly on Stripe PCI-DSS Level 1 certified infrastructure. We never store raw credit card numbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

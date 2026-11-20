"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useBilling } from "@/features/billing/hooks/use-billing";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ArrowRight, LayoutDashboard, CreditCard, Loader2 } from "lucide-react";

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user } = useAuth();
  const { subscription, refetch, openCustomerPortal, isOpenPortalLoading } = useBilling();

  useEffect(() => {
    // Re-fetch subscription status from backend once arriving from Stripe
    const timer = setTimeout(() => {
      refetch();
    }, 1500);
    return () => clearTimeout(timer);
  }, [refetch]);

  const isEmployer =
    user?.role === "EMPLOYER_ADMIN" || user?.role === "RECRUITER";
  const dashboardUrl = isEmployer
    ? "/dashboard/employer"
    : "/dashboard/candidate";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xs">
          <CheckCircle2 className="size-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
            <Sparkles className="size-3" />
            Payment Succeeded
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Subscription Activated!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Thank you for upgrading. Your account privileges and quotas have been unlocked in real-time.
          </p>
        </div>

        {/* Subscription Snapshot */}
        {subscription && (
          <div className="p-4 rounded-2xl bg-secondary/60 border border-border/60 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Active Plan</span>
              <span className="font-bold text-sky-400 uppercase tracking-wide">
                {subscription.planType}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold text-emerald-400 capitalize">
                {subscription.status.toLowerCase()}
              </span>
            </div>
            {isEmployer ? (
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Job Posting Quota</span>
                <span className="font-medium text-foreground">
                  {subscription.jobPostingLimit >= 9999
                    ? "Unlimited"
                    : `${subscription.jobPostingLimit} Jobs`}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Resume Quota</span>
                <span className="font-medium text-foreground">
                  Up to {subscription.maxResumes} Resumes
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold gap-2 cursor-pointer shadow-md"
            onClick={() => router.push(dashboardUrl)}
          >
            <LayoutDashboard className="size-4" />
            Go to Dashboard
            <ArrowRight className="size-4 ml-auto" />
          </Button>

          {subscription?.customerId && (
            <Button
              variant="outline"
              className="w-full text-xs gap-2 cursor-pointer"
              onClick={() => openCustomerPortal()}
              disabled={isOpenPortalLoading}
            >
              <CreditCard className="size-3.5" />
              Manage Billing & Invoices
            </Button>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground/70">
          A receipt has been dispatched to your email address by Stripe.
        </p>
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-sky-400" />
            <span>Confirming subscription with Stripe...</span>
          </div>
        </div>
      }
    >
      <BillingSuccessContent />
    </Suspense>
  );
}

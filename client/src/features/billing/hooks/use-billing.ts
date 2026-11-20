"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi, SubscriptionStatus } from "../api/billing-api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { toast } from "sonner";

export function useBilling() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery<SubscriptionStatus>({
    queryKey: ["subscription-status"],
    queryFn: () => billingApi.getSubscriptionStatus(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const employerCheckoutMutation = useMutation({
    mutationFn: (priceId: string) => billingApi.createEmployerCheckout(priceId),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to secure Stripe checkout...");
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to start checkout session.");
    },
  });

  const candidateCheckoutMutation = useMutation({
    mutationFn: (priceId: string) => billingApi.createCandidateCheckout(priceId),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to secure Stripe checkout...");
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to start checkout session.");
    },
  });

  const customerPortalMutation = useMutation({
    mutationFn: (returnUrl?: string) => billingApi.createCustomerPortal(returnUrl),
    onSuccess: (data) => {
      if (data.portalUrl) {
        toast.info("Opening Stripe Customer Portal...");
        window.location.href = data.portalUrl;
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to open billing portal.");
    },
  });

  return {
    subscription,
    isLoading,
    error,
    refetch,
    checkoutEmployer: employerCheckoutMutation.mutate,
    isCheckingOutEmployer: employerCheckoutMutation.isPending,
    checkoutCandidate: candidateCheckoutMutation.mutate,
    isCheckingOutCandidate: candidateCheckoutMutation.isPending,
    openCustomerPortal: customerPortalMutation.mutate,
    isOpenPortalLoading: customerPortalMutation.isPending,
  };
}

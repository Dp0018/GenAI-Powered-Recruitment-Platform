import { apiClient } from "@/lib/api";

export interface SubscriptionStatus {
  planType: "FREE" | "GROWTH" | "ENTERPRISE" | "PRO";
  status: "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "INCOMPLETE";
  isPaid: boolean;
  jobPostingLimit: number;
  currentActiveJobs: number;
  aiFeaturesEnabled: boolean;
  aiResumeOptimizerEnabled: boolean;
  spotlightBadgeEnabled: boolean;
  maxResumes: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  customerId: string | null;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface PortalResponse {
  portalUrl: string;
}

export const billingApi = {
  getSubscriptionStatus: async (): Promise<SubscriptionStatus> => {
    const res = await apiClient<SubscriptionStatus>("/billing/subscription");
    if (!res.data) throw new Error("Failed to load subscription status");
    return res.data;
  },

  createEmployerCheckout: async (priceId: string): Promise<CheckoutResponse> => {
    const res = await apiClient<CheckoutResponse>("/billing/checkout/employer", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });
    if (!res.data) throw new Error("Failed to create employer checkout session");
    return res.data;
  },

  createCandidateCheckout: async (priceId: string): Promise<CheckoutResponse> => {
    const res = await apiClient<CheckoutResponse>("/billing/checkout/candidate", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });
    if (!res.data) throw new Error("Failed to create candidate checkout session");
    return res.data;
  },

  createCustomerPortal: async (returnUrl?: string): Promise<PortalResponse> => {
    const query = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : "";
    const res = await apiClient<PortalResponse>(`/billing/portal${query}`, {
      method: "POST",
    });
    if (!res.data) throw new Error("Failed to create customer portal session");
    return res.data;
  },
};

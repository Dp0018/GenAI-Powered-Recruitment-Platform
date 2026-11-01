import { apiClient } from "@/lib/api";
import {
  CreateJobOfferPayload,
  DeclineOfferPayload,
  JobOffer,
  SignOfferPayload,
} from "../types/offer";

export const offersApi = {
  createOffer: async (payload: CreateJobOfferPayload): Promise<JobOffer> => {
    const res = await apiClient<JobOffer>("/offers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to create offer");
    return res.data;
  },

  updateOffer: async (
    id: string,
    payload: CreateJobOfferPayload
  ): Promise<JobOffer> => {
    const res = await apiClient<JobOffer>(`/offers/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to update offer");
    return res.data;
  },

  sendOffer: async (id: string): Promise<JobOffer> => {
    const res = await apiClient<JobOffer>(`/offers/${id}/send`, {
      method: "POST",
    });
    if (!res.data) throw new Error("Failed to send offer");
    return res.data;
  },

  getOfferByApplication: async (
    applicationId: string
  ): Promise<JobOffer | null> => {
    try {
      const res = await apiClient<JobOffer>(
        `/offers/application/${applicationId}`
      );
      return res.data || null;
    } catch {
      return null;
    }
  },

  getOfferById: async (id: string): Promise<JobOffer> => {
    const res = await apiClient<JobOffer>(`/offers/${id}`);
    if (!res.data) throw new Error("Offer not found");
    return res.data;
  },

  getCompanyOffers: async (): Promise<JobOffer[]> => {
    const res = await apiClient<JobOffer[]>("/offers/employer");
    return res.data || [];
  },

  getCandidateOffers: async (): Promise<JobOffer[]> => {
    const res = await apiClient<JobOffer[]>("/offers/candidate");
    return res.data || [];
  },

  getOfferByToken: async (token: string): Promise<JobOffer> => {
    const res = await apiClient<JobOffer>(`/offers/sign/${token}`);
    if (!res.data) throw new Error("Offer not found or invalid token");
    return res.data;
  },

  signOffer: async (
    token: string,
    payload: SignOfferPayload
  ): Promise<JobOffer> => {
    const res = await apiClient<JobOffer>(`/offers/sign/${token}/accept`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to electronically sign offer");
    return res.data;
  },

  declineOffer: async (
    token: string,
    payload: DeclineOfferPayload
  ): Promise<JobOffer> => {
    const res = await apiClient<JobOffer>(`/offers/sign/${token}/decline`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to decline offer");
    return res.data;
  },
};

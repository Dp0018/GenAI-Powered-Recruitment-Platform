import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offersApi } from "../api/offers-api";
import {
  CreateJobOfferPayload,
  DeclineOfferPayload,
  SignOfferPayload,
} from "../types/offer";
import { toast } from "sonner";

export const OFFERS_QUERY_KEY = ["offers"];

export function useCompanyOffersQuery() {
  return useQuery({
    queryKey: [...OFFERS_QUERY_KEY, "company"],
    queryFn: offersApi.getCompanyOffers,
  });
}

export function useCandidateOffersQuery() {
  return useQuery({
    queryKey: [...OFFERS_QUERY_KEY, "candidate"],
    queryFn: offersApi.getCandidateOffers,
  });
}

export function useOfferByApplicationQuery(applicationId: string | null | undefined) {
  return useQuery({
    queryKey: [...OFFERS_QUERY_KEY, "application", applicationId],
    queryFn: () => (applicationId ? offersApi.getOfferByApplication(applicationId) : null),
    enabled: Boolean(applicationId),
  });
}

export function useCreateOfferMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobOfferPayload) => offersApi.createOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Offer draft created successfully!");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create offer");
    },
  });
}

export function useUpdateOfferMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateJobOfferPayload }) =>
      offersApi.updateOffer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      toast.success("Offer details updated successfully!");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update offer");
    },
  });
}

export function useSendOfferMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => offersApi.sendOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Offer letter formally sent to candidate with e-signature link! 🎉");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send offer letter");
    },
  });
}

export function useSignOfferMutation(token: string, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignOfferPayload) => offersApi.signOffer(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Offer electronically signed & accepted! Congratulations! 🚀");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to sign offer");
    },
  });
}

export function useDeclineOfferMutation(token: string, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeclineOfferPayload) => offersApi.declineOffer(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.info("Offer decision logged.");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to decline offer");
    },
  });
}

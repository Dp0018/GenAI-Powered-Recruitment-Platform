import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewsApi } from "../api/interviews-api";
import {
  CreateInterviewPayload,
  ProposeSlotsPayload,
  SelectSlotPayload,
} from "../types/interview";
import { toast } from "sonner";

export const INTERVIEWS_QUERY_KEY = ["interviews"];

export function useEmployerInterviewsQuery() {
  return useQuery({
    queryKey: [...INTERVIEWS_QUERY_KEY, "employer"],
    queryFn: interviewsApi.getEmployerInterviews,
  });
}

export function useCandidateInterviewsQuery() {
  return useQuery({
    queryKey: [...INTERVIEWS_QUERY_KEY, "candidate"],
    queryFn: interviewsApi.getCandidateInterviews,
  });
}

export function useScheduleInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInterviewPayload) => interviewsApi.scheduleInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Interview scheduled & invitation sent to candidate!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to schedule interview");
    },
  });
}

export function useProposeSlotsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProposeSlotsPayload) => interviewsApi.proposeSlots(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Proposed time slots sent to candidate for self-booking!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to propose interview slots");
    },
  });
}

export function useSelectSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SelectSlotPayload) => interviewsApi.selectSlot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Interview booked successfully! Calendar invite (.ics) generated.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to book interview slot");
    },
  });
}

export function useCancelInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interviewId: string) => interviewsApi.cancelInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      toast.success("Interview has been cancelled");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel interview");
    },
  });
}

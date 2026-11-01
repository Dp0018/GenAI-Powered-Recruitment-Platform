"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { screeningNotesApi } from "../api/screening-notes-api";
import { CreateScreeningNotePayload } from "../types/screening-note";
import { toast } from "sonner";

export function useScorecardQuery(applicationId?: string, enabled = true) {
  return useQuery({
    queryKey: ["application-scorecard", applicationId],
    queryFn: () => screeningNotesApi.getScorecard(applicationId!),
    enabled: Boolean(applicationId) && enabled,
    staleTime: 1000 * 15,
  });
}

export function useAddScreeningNoteMutation(applicationId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateScreeningNotePayload) =>
      screeningNotesApi.addScreeningNote(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application-scorecard", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["company-applications"] });
      toast.success("Internal evaluation saved successfully");
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save internal evaluation");
    },
  });
}

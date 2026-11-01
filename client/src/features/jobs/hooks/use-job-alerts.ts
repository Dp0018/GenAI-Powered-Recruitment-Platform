"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobAlertsApi } from "../api/job-alerts-api";
import { CreateJobAlertPayload } from "../types/job-alert";
import { toast } from "sonner";

export const JOB_ALERTS_QUERY_KEY = ["job-alerts"];

export function useJobAlertsQuery(enabled = true) {
  return useQuery({
    queryKey: JOB_ALERTS_QUERY_KEY,
    queryFn: jobAlertsApi.getMyAlerts,
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useCreateJobAlertMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobAlertPayload) => jobAlertsApi.createAlert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_ALERTS_QUERY_KEY });
      toast.success("Job alert created! You'll receive email digests for matching roles.");
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create job alert");
    },
  });
}

export function useToggleJobAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => jobAlertsApi.toggleAlert(alertId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: JOB_ALERTS_QUERY_KEY });
      toast.success(data.active ? "Job alert activated" : "Job alert paused");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to toggle job alert");
    },
  });
}

export function useDeleteJobAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => jobAlertsApi.deleteAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_ALERTS_QUERY_KEY });
      toast.success("Job alert deleted");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete job alert");
    },
  });
}

export function useTriggerJobAlertDigestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobAlertsApi.triggerDigestSweep,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: JOB_ALERTS_QUERY_KEY });
      toast.success(`Digest sweep finished: ${res.digestsDispatched} notification email(s) sent`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to trigger digest sweep");
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications-api";
import {
  SubmitApplicationPayload,
  UpdateApplicationStatusPayload,
} from "../types/application";
import { toast } from "sonner";

export function useApplicationStatusQuery(jobId: string, enabled = true) {
  return useQuery({
    queryKey: ["application-status", jobId],
    queryFn: () => applicationsApi.checkStatus(jobId),
    enabled: Boolean(jobId) && enabled,
    staleTime: 1000 * 60,
  });
}

export function useMyApplicationsQuery(page = 0, size = 10) {
  return useQuery({
    queryKey: ["my-applications", page, size],
    queryFn: () => applicationsApi.getMyApplications(page, size),
    staleTime: 1000 * 30,
  });
}

export function useCompanyApplicationsQuery(jobId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: ["company-applications", jobId, page, size],
    queryFn: () => applicationsApi.getCompanyApplications(jobId, page, size),
    staleTime: 1000 * 30,
  });
}

export function useSubmitApplicationMutation(jobId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitApplicationPayload) =>
      applicationsApi.submitApplication(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application-status", jobId] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["company-applications"] });
      queryClient.invalidateQueries({ queryKey: ["job-detail"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Application submitted successfully!");
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit application");
    },
  });
}

export function useUpdateApplicationStatusMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      payload,
    }: {
      applicationId: string;
      payload: UpdateApplicationStatusPayload;
    }) => applicationsApi.updateStatus(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-applications"] });
      toast.success("Applicant status updated successfully");
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status");
    },
  });
}

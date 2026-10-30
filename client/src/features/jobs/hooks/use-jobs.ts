"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "../api/jobs-api";
import { CreateJobPayload, SearchJobsParams } from "../types/job";
import { toast } from "sonner";

export function useJobsQuery(params: SearchJobsParams = {}) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => jobsApi.searchJobs(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useJobDetailQuery(slug: string) {
  return useQuery({
    queryKey: ["job-detail", slug],
    queryFn: () => jobsApi.getJobBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompanyJobsQuery(page = 0, size = 10, enabled = true) {
  return useQuery({
    queryKey: ["company-jobs", page, size],
    queryFn: () => jobsApi.getMyCompanyJobs(page, size),
    enabled,
    staleTime: 1000 * 30,
  });
}

export function useCreateJobMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => jobsApi.createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job requisition published successfully");
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to publish job requisition");
    },
  });
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job requisition deleted");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete requisition");
    },
  });
}

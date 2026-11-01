import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "../api/ai-api";
import { toast } from "sonner";

export function useJobFraudAnalysisQuery(jobId?: string, enabled = true) {
  return useQuery({
    queryKey: ["ai-job-fraud", jobId],
    queryFn: () => aiApi.getJobFraudAnalysis(jobId!),
    enabled: Boolean(jobId) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExplainJobMatchQuery(jobId?: string, enabled = false) {
  return useQuery({
    queryKey: ["ai-explain-job-match", jobId],
    queryFn: () => aiApi.explainJobMatch(jobId!),
    enabled: Boolean(jobId) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExplainApplicationMatchQuery(applicationId?: string, enabled = false) {
  return useQuery({
    queryKey: ["ai-explain-app-match", applicationId],
    queryFn: () => aiApi.explainApplicationMatch(applicationId!),
    enabled: Boolean(applicationId) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useScanResumeMutation() {
  return useMutation({
    mutationFn: (resumeText: string) => aiApi.scanResumeText(resumeText),
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Resume scan failed";
      toast.error(msg);
    },
  });
}

export function useQuarantinedJobsQuery(page = 0, size = 10) {
  return useQuery({
    queryKey: ["admin-quarantined-jobs", page, size],
    queryFn: () => aiApi.getQuarantinedJobs(page, size),
  });
}

export function useApproveQuarantinedJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => aiApi.approveQuarantinedJob(jobId),
    onSuccess: (job) => {
      toast.success(`Job "${job.title}" cleared from quarantine and published`);
      queryClient.invalidateQueries({ queryKey: ["admin-quarantined-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to approve job";
      toast.error(msg);
    },
  });
}

export function useRejectQuarantinedJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => aiApi.rejectQuarantinedJob(jobId),
    onSuccess: (job) => {
      toast.info(`Job "${job.title}" rejected and permanently closed`);
      queryClient.invalidateQueries({ queryKey: ["admin-quarantined-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to reject job";
      toast.error(msg);
    },
  });
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { ragApi } from "../api/rag-api";
import {
  TalentSearchRequest,
  ResumeOptimizeRequest,
  ResumeChatRequest,
} from "../types/rag";

export const useTalentSearchMutation = () => {
  return useMutation({
    mutationFn: (request: TalentSearchRequest) =>
      ragApi.searchTalentPool(request),
  });
};

export const useGroundedJobFitQuery = (
  jobId?: string,
  candidateId?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["rag", "job-fit", jobId, candidateId],
    queryFn: () => ragApi.getGroundedJobFit(jobId!, candidateId),
    enabled: Boolean(jobId && enabled),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOptimizeResumeBulletMutation = () => {
  return useMutation({
    mutationFn: (request: ResumeOptimizeRequest) =>
      ragApi.optimizeResumeBullet(request),
  });
};

export const useResumeChatMutation = (candidateId: string) => {
  return useMutation({
    mutationFn: (request: ResumeChatRequest) =>
      ragApi.chatWithCandidateResume(candidateId, request),
  });
};


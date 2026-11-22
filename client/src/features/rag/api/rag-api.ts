import { apiClient } from "@/lib/api";
import {
  TalentSearchRequest,
  TalentSearchResponse,
  ResumeJobFitResponse,
  ResumeOptimizeRequest,
  ResumeOptimizeResponse,
  ResumeChatRequest,
  ResumeChatResponse,
} from "../types/rag";

export const ragApi = {
  searchTalentPool: async (
    request: TalentSearchRequest
  ): Promise<TalentSearchResponse> => {
    const res = await apiClient<TalentSearchResponse>("/rag/talent-search", {
      method: "POST",
      body: JSON.stringify(request),
    });
    if (!res.data) throw new Error("Semantic talent search failed");
    return res.data;
  },

  getGroundedJobFit: async (
    jobId: string,
    candidateId?: string
  ): Promise<ResumeJobFitResponse> => {
    const url = candidateId
      ? `/rag/jobs/${jobId}/fit?candidateId=${encodeURIComponent(candidateId)}`
      : `/rag/jobs/${jobId}/fit`;
    const res = await apiClient<ResumeJobFitResponse>(url);
    if (!res.data) throw new Error("Failed to generate Grounded Job Fit");
    return res.data;
  },

  optimizeResumeBullet: async (
    request: ResumeOptimizeRequest
  ): Promise<ResumeOptimizeResponse> => {
    const res = await apiClient<ResumeOptimizeResponse>("/rag/optimize-bullet", {
      method: "POST",
      body: JSON.stringify(request),
    });
    if (!res.data) throw new Error("Resume bullet optimization failed");
    return res.data;
  },

  chatWithCandidateResume: async (
    candidateId: string,
    request: ResumeChatRequest
  ): Promise<ResumeChatResponse> => {
    const res = await apiClient<ResumeChatResponse>(
      `/rag/candidates/${candidateId}/chat`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
    if (!res.data) throw new Error("Resume Q&A failed");
    return res.data;
  },

  indexCandidate: async (candidateId: string): Promise<void> => {
    await apiClient(`/rag/candidates/${candidateId}/index`, {
      method: "POST",
    });
  },
};


import { apiClient } from "@/lib/api";
import { CandidateResume, CreateCandidateResumePayload } from "../types/resume";

export const resumesApi = {
  getMyResumes: async (): Promise<CandidateResume[]> => {
    const res = await apiClient<CandidateResume[]>("/candidate/resumes");
    return res.data || [];
  },

  addResume: async (
    payload: CreateCandidateResumePayload
  ): Promise<CandidateResume> => {
    const res = await apiClient<CandidateResume>("/candidate/resumes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to add resume to library");
    return res.data;
  },

  setDefaultResume: async (id: string): Promise<CandidateResume> => {
    const res = await apiClient<CandidateResume>(
      `/candidate/resumes/${id}/default`,
      {
        method: "PUT",
      }
    );
    if (!res.data) throw new Error("Failed to update default resume");
    return res.data;
  },

  deleteResume: async (id: string): Promise<void> => {
    await apiClient<void>(`/candidate/resumes/${id}`, {
      method: "DELETE",
    });
  },
};

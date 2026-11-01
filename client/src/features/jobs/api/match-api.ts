import { apiClient } from "@/lib/api";
import { SkillsMatchResponse } from "../types/match";

export const matchApi = {
  getJobMatch: async (jobId: string): Promise<SkillsMatchResponse | null> => {
    try {
      const res = await apiClient<SkillsMatchResponse>(`/jobs/${jobId}/match`);
      return res.data || null;
    } catch {
      return null;
    }
  },

  getApplicationMatch: async (applicationId: string): Promise<SkillsMatchResponse | null> => {
    try {
      const res = await apiClient<SkillsMatchResponse>(`/applications/${applicationId}/match`);
      return res.data || null;
    } catch {
      return null;
    }
  },
};

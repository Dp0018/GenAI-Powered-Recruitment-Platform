import { apiClient } from "@/lib/api";
import { InterviewItem, CreateInterviewPayload } from "../types/interview";

export const interviewsApi = {
  scheduleInterview: async (payload: CreateInterviewPayload): Promise<InterviewItem> => {
    const res = await apiClient<InterviewItem>("/interviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to schedule interview");
    return res.data;
  },

  getEmployerInterviews: async (): Promise<InterviewItem[]> => {
    const res = await apiClient<InterviewItem[]>("/interviews/employer");
    return res.data || [];
  },

  getCandidateInterviews: async (): Promise<InterviewItem[]> => {
    const res = await apiClient<InterviewItem[]>("/interviews/candidate");
    return res.data || [];
  },

  cancelInterview: async (interviewId: string): Promise<InterviewItem> => {
    const res = await apiClient<InterviewItem>(`/interviews/${interviewId}/cancel`, {
      method: "PUT",
    });
    if (!res.data) throw new Error("Failed to cancel interview");
    return res.data;
  },
};

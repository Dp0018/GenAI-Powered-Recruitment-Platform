import { apiClient } from "@/lib/api";
import {
  InterviewItem,
  CreateInterviewPayload,
  ProposeSlotsPayload,
  SelectSlotPayload,
} from "../types/interview";

export const interviewsApi = {
  scheduleInterview: async (payload: CreateInterviewPayload): Promise<InterviewItem> => {
    const res = await apiClient<InterviewItem>("/interviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to schedule interview");
    return res.data;
  },

  proposeSlots: async (payload: ProposeSlotsPayload): Promise<InterviewItem> => {
    const res = await apiClient<InterviewItem>("/interviews/propose-slots", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to propose interview slots");
    return res.data;
  },

  selectSlot: async (payload: SelectSlotPayload): Promise<InterviewItem> => {
    const res = await apiClient<InterviewItem>(`/interviews/${payload.interviewId}/select-slot`, {
      method: "POST",
      body: JSON.stringify({ selectedSlot: payload.selectedSlot }),
    });
    if (!res.data) throw new Error("Failed to confirm selected slot");
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

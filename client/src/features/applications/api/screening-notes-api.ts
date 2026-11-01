import { apiClient } from "@/lib/api";
import {
  ApplicationScorecard,
  CreateScreeningNotePayload,
  ScreeningNoteItem,
} from "../types/screening-note";

export const screeningNotesApi = {
  getScorecard: async (applicationId: string): Promise<ApplicationScorecard> => {
    const res = await apiClient<ApplicationScorecard>(
      `/applications/${applicationId}/screening-notes`
    );
    if (!res.data) {
      return {
        applicationId,
        averageRating: null,
        totalReviews: 0,
        notes: [],
      };
    }
    return res.data;
  },

  addScreeningNote: async (
    applicationId: string,
    payload: CreateScreeningNotePayload
  ): Promise<ScreeningNoteItem> => {
    const res = await apiClient<ScreeningNoteItem>(
      `/applications/${applicationId}/screening-notes`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    if (!res.data) throw new Error("Failed to record screening note");
    return res.data;
  },
};

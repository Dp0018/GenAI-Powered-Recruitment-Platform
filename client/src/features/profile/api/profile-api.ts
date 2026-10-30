import { apiClient } from "@/lib/api";
import { CandidateProfile, UpdateCandidateProfilePayload } from "../types/profile";
import { FileUploadResponse } from "@/features/applications/api/applications-api";

export const profileApi = {
  getProfile: async (): Promise<CandidateProfile> => {
    const res = await apiClient<CandidateProfile>("/candidate/profile");
    if (!res.data) throw new Error("Failed to fetch candidate profile");
    return res.data;
  },

  updateProfile: async (
    payload: UpdateCandidateProfilePayload
  ): Promise<CandidateProfile> => {
    const res = await apiClient<CandidateProfile>("/candidate/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to update candidate profile");
    return res.data;
  },

  uploadAvatar: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient<FileUploadResponse>("/files/upload/avatar", {
      method: "POST",
      body: formData,
    });
    if (!res.data) throw new Error("Avatar upload failed");
    return res.data;
  },
};

import { apiClient } from "@/lib/api";
import {
  CandidateProfile,
  EducationHistoryItem,
  UpdateCandidateProfilePayload,
  WorkExperienceItem,
} from "../types/profile";
import { FileUploadResponse } from "@/features/applications/api/applications-api";

export const profileApi = {
  getProfile: async (): Promise<CandidateProfile> => {
    const res = await apiClient<CandidateProfile>("/candidate/profile");
    if (!res.data) throw new Error("Failed to fetch candidate profile");
    return res.data;
  },

  getCandidateProfileById: async (candidateUserId: string): Promise<CandidateProfile> => {
    const res = await apiClient<CandidateProfile>(`/candidate/profile/candidate/${candidateUserId}`);
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

  addWorkExperience: async (
    payload: WorkExperienceItem
  ): Promise<WorkExperienceItem> => {
    const res = await apiClient<WorkExperienceItem>("/candidate/profile/experience", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to add work experience");
    return res.data;
  },

  updateWorkExperience: async (
    experienceId: string,
    payload: WorkExperienceItem
  ): Promise<WorkExperienceItem> => {
    const res = await apiClient<WorkExperienceItem>(
      `/candidate/profile/experience/${experienceId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    if (!res.data) throw new Error("Failed to update work experience");
    return res.data;
  },

  deleteWorkExperience: async (experienceId: string): Promise<void> => {
    await apiClient<void>(`/candidate/profile/experience/${experienceId}`, {
      method: "DELETE",
    });
  },

  addEducationHistory: async (
    payload: EducationHistoryItem
  ): Promise<EducationHistoryItem> => {
    const res = await apiClient<EducationHistoryItem>("/candidate/profile/education", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to add education record");
    return res.data;
  },

  updateEducationHistory: async (
    educationId: string,
    payload: EducationHistoryItem
  ): Promise<EducationHistoryItem> => {
    const res = await apiClient<EducationHistoryItem>(
      `/candidate/profile/education/${educationId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    if (!res.data) throw new Error("Failed to update education record");
    return res.data;
  },

  deleteEducationHistory: async (educationId: string): Promise<void> => {
    await apiClient<void>(`/candidate/profile/education/${educationId}`, {
      method: "DELETE",
    });
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

  parseResume: async (payload: { resumeUrl?: string; resumeText?: string }) => {
    const res = await apiClient<import("../types/profile").ParsedResumeDto>(
      "/candidate/profile/parse-resume",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    if (!res.data) throw new Error("Failed to parse resume");
    return res.data;
  },
};

import { apiClient } from "@/lib/api";
import { PagedResponse } from "@/types/auth";
import {
  ApplicationItem,
  SubmitApplicationPayload,
  UpdateApplicationStatusPayload,
} from "../types/application";

export interface FileUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  fileType: string;
}

export const applicationsApi = {
  submitApplication: async (
    jobId: string,
    payload: SubmitApplicationPayload
  ): Promise<ApplicationItem> => {
    const res = await apiClient<ApplicationItem>(`/applications/jobs/${jobId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Application submission failed");
    return res.data;
  },

  checkStatus: async (jobId: string): Promise<boolean> => {
    const res = await apiClient<boolean>(`/applications/jobs/${jobId}/status`);
    return Boolean(res.data);
  },

  getMyApplications: async (
    page = 0,
    size = 10
  ): Promise<PagedResponse<ApplicationItem>> => {
    const res = await apiClient<PagedResponse<ApplicationItem>>(
      `/applications/my-applications?page=${page}&size=${size}`
    );
    return (
      res.data || {
        content: [],
        pageNumber: 0,
        pageSize: size,
        totalElements: 0,
        totalPages: 0,
        last: true,
      }
    );
  },

  getCompanyApplications: async (
    jobId?: string,
    page = 0,
    size = 10
  ): Promise<PagedResponse<ApplicationItem>> => {
    const url = `/applications/company?${jobId ? `jobId=${jobId}&` : ""}page=${page}&size=${size}`;
    const res = await apiClient<PagedResponse<ApplicationItem>>(url);
    return (
      res.data || {
        content: [],
        pageNumber: 0,
        pageSize: size,
        totalElements: 0,
        totalPages: 0,
        last: true,
      }
    );
  },

  updateStatus: async (
    applicationId: string,
    payload: UpdateApplicationStatusPayload
  ): Promise<ApplicationItem> => {
    const res = await apiClient<ApplicationItem>(
      `/applications/${applicationId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    if (!res.data) throw new Error("Status update response was empty");
    return res.data;
  },

  withdrawApplication: async (applicationId: string): Promise<ApplicationItem> => {
    const res = await apiClient<ApplicationItem>(
      `/applications/${applicationId}/withdraw`,
      {
        method: "PUT",
      }
    );
    if (!res.data) throw new Error("Application withdrawal failed");
    return res.data;
  },

  uploadResume: async (file: File): Promise<{
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl?: string;
    size: number;
    fileType: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient<{
      fileId: string;
      name: string;
      url: string;
      thumbnailUrl?: string;
      size: number;
      fileType: string;
    }>("/files/upload/resume", {
      method: "POST",
      body: formData,
    });
    if (!res.data) throw new Error("Resume upload failed");
    return res.data;
  },
};


import { apiClient } from "@/lib/api";
import { Company, PublicCompanyDetail, UpdateCompanyPayload } from "../types/company";
import { FileUploadResponse } from "@/features/applications/api/applications-api";

export const companiesApi = {
  getPublicCompanyBySlug: async (slug: string): Promise<PublicCompanyDetail> => {
    const res = await apiClient<PublicCompanyDetail>(`/public/companies/${slug}`);
    if (!res.data) throw new Error("Company not found");
    return res.data;
  },

  getMyCompany: async (): Promise<Company> => {
    const res = await apiClient<Company>("/company/my-company");
    if (!res.data) throw new Error("Failed to fetch corporate profile");
    return res.data;
  },

  updateMyCompany: async (payload: UpdateCompanyPayload): Promise<Company> => {
    const res = await apiClient<Company>("/company/my-company", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to update company profile");
    return res.data;
  },

  uploadLogo: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient<FileUploadResponse>("/files/upload/company-logo", {
      method: "POST",
      body: formData,
    });
    if (!res.data) throw new Error("Company logo upload failed");
    return res.data;
  },

  uploadBanner: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient<FileUploadResponse>("/files/upload/company-banner", {
      method: "POST",
      body: formData,
    });
    if (!res.data) throw new Error("Company banner upload failed");
    return res.data;
  },
};

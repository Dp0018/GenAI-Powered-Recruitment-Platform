import { apiClient } from "@/lib/api";
import {
  AdminAnalytics,
  AdminUser,
  BanUserPayload,
  RejectCompanyPayload,
  PagedResponse,
} from "../types/admin";
import { Company, VerificationStatus } from "@/features/companies/types/company";
import { Role } from "@/types/auth";

export interface GetAdminCompaniesParams {
  status?: VerificationStatus | "";
  search?: string;
  page?: number;
  size?: number;
}

export interface GetAdminUsersParams {
  role?: Role | "";
  banned?: boolean;
  search?: string;
  page?: number;
  size?: number;
}

export const adminApi = {
  getAnalytics: async (): Promise<AdminAnalytics> => {
    const res = await apiClient<AdminAnalytics>("/admin/analytics");
    if (!res.data) throw new Error("Failed to load platform analytics");
    return res.data;
  },

  getCompanies: async (params?: GetAdminCompaniesParams): Promise<PagedResponse<Company>> => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.page !== undefined) query.append("page", params.page.toString());
    if (params?.size !== undefined) query.append("size", params.size.toString());

    const qs = query.toString();
    const url = `/admin/companies${qs ? `?${qs}` : ""}`;
    const res = await apiClient<PagedResponse<Company>>(url);
    if (!res.data) throw new Error("Failed to load companies");
    return res.data;
  },

  verifyCompany: async (companyId: string): Promise<Company> => {
    const res = await apiClient<Company>(`/admin/companies/${companyId}/verify`, {
      method: "PUT",
    });
    if (!res.data) throw new Error("Failed to verify company");
    return res.data;
  },

  rejectCompany: async (companyId: string, payload?: RejectCompanyPayload): Promise<Company> => {
    const res = await apiClient<Company>(`/admin/companies/${companyId}/reject`, {
      method: "PUT",
      body: JSON.stringify(payload || {}),
    });
    if (!res.data) throw new Error("Failed to reject company");
    return res.data;
  },

  getUsers: async (params?: GetAdminUsersParams): Promise<PagedResponse<AdminUser>> => {
    const query = new URLSearchParams();
    if (params?.role) query.append("role", params.role);
    if (params?.banned !== undefined) query.append("banned", params.banned.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.page !== undefined) query.append("page", params.page.toString());
    if (params?.size !== undefined) query.append("size", params.size.toString());

    const qs = query.toString();
    const url = `/admin/users${qs ? `?${qs}` : ""}`;
    const res = await apiClient<PagedResponse<AdminUser>>(url);
    if (!res.data) throw new Error("Failed to load users");
    return res.data;
  },

  banUser: async (userId: string, payload: BanUserPayload): Promise<AdminUser> => {
    const res = await apiClient<AdminUser>(`/admin/users/${userId}/ban`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to ban user");
    return res.data;
  },

  unbanUser: async (userId: string): Promise<AdminUser> => {
    const res = await apiClient<AdminUser>(`/admin/users/${userId}/unban`, {
      method: "PUT",
    });
    if (!res.data) throw new Error("Failed to unban user");
    return res.data;
  },
};

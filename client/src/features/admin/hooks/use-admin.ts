"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  GetAdminCompaniesParams,
  GetAdminUsersParams,
} from "../api/admin-api";
import { BanUserPayload, RejectCompanyPayload } from "../types/admin";
import { toast } from "sonner";

export function useAdminAnalyticsQuery() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminApi.getAnalytics(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Auto refresh every 60s
  });
}

export function useAdminCompaniesQuery(params?: GetAdminCompaniesParams) {
  return useQuery({
    queryKey: ["admin-companies", params],
    queryFn: () => adminApi.getCompanies(params),
    staleTime: 1000 * 30,
  });
}

export function useVerifyCompanyMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => adminApi.verifyCompany(companyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["public-company", data.slug] });
      toast.success(`Verified "${data.name}" successfully`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to verify company");
    },
  });
}

export function useRejectCompanyMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: string;
      payload?: RejectCompanyPayload;
    }) => adminApi.rejectCompany(companyId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["public-company", data.slug] });
      toast.success(`Verification rejected for "${data.name}"`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject company");
    },
  });
}

export function useAdminUsersQuery(params?: GetAdminUsersParams) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminApi.getUsers(params),
    staleTime: 1000 * 30,
  });
}

export function useBanUserMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: BanUserPayload;
    }) => adminApi.banUser(userId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      toast.warning(`Account for ${data.email} has been suspended`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to ban user");
    },
  });
}

export function useUnbanUserMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.unbanUser(userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      toast.success(`Restored access for ${data.email}`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unban user");
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "../api/companies-api";
import { UpdateCompanyPayload } from "../types/company";
import { toast } from "sonner";

export function usePublicCompanyQuery(slug: string) {
  return useQuery({
    queryKey: ["public-company", slug],
    queryFn: () => companiesApi.getPublicCompanyBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyCompanyQuery() {
  return useQuery({
    queryKey: ["my-company"],
    queryFn: () => companiesApi.getMyCompany(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateMyCompanyMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) => companiesApi.updateMyCompany(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["my-company"], data);
      queryClient.invalidateQueries({ queryKey: ["public-company", data.slug] });
      toast.success("Company profile updated successfully");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update company profile");
    },
  });
}

export function useUploadCompanyLogoMutation(onUploaded?: (url: string) => void) {
  return useMutation({
    mutationFn: (file: File) => companiesApi.uploadLogo(file),
    onSuccess: (res) => {
      toast.success("Logo uploaded to CDN");
      onUploaded?.(res.url);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload logo");
    },
  });
}

export function useUploadCompanyBannerMutation(onUploaded?: (url: string) => void) {
  return useMutation({
    mutationFn: (file: File) => companiesApi.uploadBanner(file),
    onSuccess: (res) => {
      toast.success("Banner uploaded to CDN");
      onUploaded?.(res.url);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload banner");
    },
  });
}

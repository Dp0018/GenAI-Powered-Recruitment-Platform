import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile-api";
import {
  EducationHistoryItem,
  UpdateCandidateProfilePayload,
  WorkExperienceItem,
} from "../types/profile";
import { toast } from "sonner";

export const PROFILE_QUERY_KEY = ["candidate-profile"];

export function useProfileQuery(enabled = true) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfileMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCandidateProfilePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      toast.success("Profile saved successfully");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    },
  });
}

export function useAddWorkExperienceMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkExperienceItem) => profileApi.addWorkExperience(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success("Work experience added successfully");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to add work experience";
      toast.error(msg);
    },
  });
}

export function useDeleteWorkExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) => profileApi.deleteWorkExperience(experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success("Work experience removed");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete work experience";
      toast.error(msg);
    },
  });
}

export function useAddEducationHistoryMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EducationHistoryItem) => profileApi.addEducationHistory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success("Education record added successfully");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to add education record";
      toast.error(msg);
    },
  });
}

export function useDeleteEducationHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (educationId: string) => profileApi.deleteEducationHistory(educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success("Education record removed");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete education record";
      toast.error(msg);
    },
  });
}

export function useCandidateProfileByIdQuery(userId?: string) {
  return useQuery({
    queryKey: ["candidate-profile", userId],
    queryFn: () => profileApi.getCandidateProfileById(userId!),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });
}

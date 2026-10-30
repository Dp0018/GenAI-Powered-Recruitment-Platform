import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile-api";
import { UpdateCandidateProfilePayload } from "../types/profile";
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

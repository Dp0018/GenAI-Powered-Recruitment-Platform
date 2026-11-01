import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumesApi } from "../api/resumes-api";
import { CreateCandidateResumePayload } from "../types/resume";
import { toast } from "sonner";

export const RESUMES_QUERY_KEY = ["candidate-resumes"];

export function useCandidateResumesQuery() {
  return useQuery({
    queryKey: RESUMES_QUERY_KEY,
    queryFn: resumesApi.getMyResumes,
  });
}

export function useAddCandidateResumeMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCandidateResumePayload) =>
      resumesApi.addResume(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
      toast.success("Targeted resume added to your library! 📄");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add resume");
    },
  });
}

export function useSetDefaultResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumesApi.setDefaultResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
      toast.success("Default resume updated for 1-click apply!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update default resume");
    },
  });
}

export function useDeleteCandidateResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumesApi.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
      toast.info("Resume removed from library");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete resume");
    },
  });
}

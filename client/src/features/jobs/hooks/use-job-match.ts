import { useQuery } from "@tanstack/react-query";
import { matchApi } from "../api/match-api";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function useJobMatchQuery(jobId?: string) {
  const { user } = useAuth();
  const isCandidate = user?.role === "CANDIDATE";

  return useQuery({
    queryKey: ["job-match", jobId],
    queryFn: () => (jobId ? matchApi.getJobMatch(jobId) : null),
    enabled: Boolean(jobId && isCandidate),
    staleTime: 5 * 60 * 1000,
  });
}

export function useApplicationMatchQuery(applicationId?: string) {
  const { user } = useAuth();
  const isEmployer = user?.role === "EMPLOYER_ADMIN" || user?.role === "RECRUITER";

  return useQuery({
    queryKey: ["app-match", applicationId],
    queryFn: () => (applicationId ? matchApi.getApplicationMatch(applicationId) : null),
    enabled: Boolean(applicationId && isEmployer),
    staleTime: 5 * 60 * 1000,
  });
}

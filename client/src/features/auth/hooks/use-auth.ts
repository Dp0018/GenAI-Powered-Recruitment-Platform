"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { getAccessToken, getRefreshToken, clearAuthTokens } from "../utils/session";
import { UserResponse, Role, CompanyResponse } from "@/types/auth";
import { useRouter } from "next/navigation";

export interface UseAuthReturn {
  user: UserResponse | null;
  role: Role | null;
  company: CompanyResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery<UserResponse | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) return null;
      return authApi.getCurrentUser();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          await authApi.logout(refreshToken);
        } catch {
          // ignore network error on logout
        }
      }
    },
    onSettled: () => {
      clearAuthTokens();
      queryClient.setQueryData(["auth-user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/login");
    },
  });

  return {
    user,
    role: user?.role ?? null,
    company: user?.company ?? null,
    isAuthenticated: !!user,
    isLoading,
    logout: () => logoutMutation.mutate(),
  };
}

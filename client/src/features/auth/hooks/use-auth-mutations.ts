"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { saveAuthTokens } from "../utils/session";
import {
  LoginCredentials,
  RegisterCandidatePayload,
  RegisterEmployerPayload,
  SendOtpPayload,
  VerifyOtpPayload,
  AuthResponse,
  UserResponse,
} from "@/types/auth";
import { toast } from "sonner";

export function useLoginMutation(onSuccessCallback?: (data: AuthResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      saveAuthTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(["auth-user"], data.user);
      toast.success("Signed in successfully");
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      toast.error(message);
    },
  });
}

export function useRegisterCandidateMutation(onSuccessCallback?: (data: AuthResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterCandidatePayload) => authApi.registerCandidate(payload),
    onSuccess: (data) => {
      saveAuthTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(["auth-user"], data.user);
      toast.success("Account created successfully");
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Candidate registration failed";
      toast.error(message);
    },
  });
}

export function useRegisterEmployerMutation(onSuccessCallback?: (data: AuthResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterEmployerPayload) => authApi.registerEmployer(payload),
    onSuccess: (data) => {
      saveAuthTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(["auth-user"], data.user);
      toast.success("Company profile created successfully");
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Employer registration failed";
      toast.error(message);
    },
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (payload: SendOtpPayload) => authApi.sendOtp(payload),
    onSuccess: (message) => {
      toast.success(message || "New verification code sent");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to dispatch verification code";
      toast.error(message);
    },
  });
}

export function useVerifyOtpMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onSuccess: (message) => {
      queryClient.setQueryData<UserResponse | null>(["auth-user"], (prev) =>
        prev ? { ...prev, emailVerified: true } : prev
      );
      toast.success(message || "Email address verified");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Invalid or expired verification passcode";
      toast.error(message);
    },
  });
}

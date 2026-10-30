import { apiClient } from "@/lib/api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCandidatePayload,
  RegisterEmployerPayload,
  SendOtpPayload,
  VerifyOtpPayload,
  UserResponse,
} from "@/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (!res.data) throw new Error("Authentication response was empty");
    return res.data;
  },

  registerCandidate: async (
    payload: RegisterCandidatePayload,
  ): Promise<AuthResponse> => {
    const res = await apiClient<AuthResponse>("/auth/register/candidate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Candidate registration response was empty");
    return res.data;
  },

  registerEmployer: async (
    payload: RegisterEmployerPayload,
  ): Promise<AuthResponse> => {
    const res = await apiClient<AuthResponse>("/auth/register/employer", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Employer registration response was empty");
    return res.data;
  },

  sendOtp: async (payload: SendOtpPayload): Promise<string> => {
    const res = await apiClient<string>("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.message || "OTP code sent to email";
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<string> => {
    const res = await apiClient<string>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.message || "Email verified successfully";
  },

  getCurrentUser: async (): Promise<UserResponse | null> => {
    try {
      const res = await apiClient<UserResponse>("/auth/me");
      return res.data || null;
    } catch {
      return null;
    }
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};

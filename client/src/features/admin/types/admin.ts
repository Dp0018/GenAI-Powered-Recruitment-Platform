import { Role } from "@/types/auth";

export interface AdminAnalytics {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  bannedUsers: number;
  totalCompanies: number;
  pendingCompanies: number;
  verifiedCompanies: number;
  rejectedCompanies: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  banned: boolean;
  banReason?: string | null;
  banExpires?: string | null;
  phone?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  createdAt: string;
}

export interface BanUserPayload {
  reason: string;
  durationDays?: number;
}

export interface RejectCompanyPayload {
  reason: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

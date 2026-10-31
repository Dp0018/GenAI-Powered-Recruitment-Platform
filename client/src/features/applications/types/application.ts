import { VerificationStatus } from "@/types/auth";

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "INTERVIEWING"
  | "OFFERED"
  | "REJECTED"
  | "WITHDRAWN";

export interface ApplicationJobSummary {
  id: string;
  title: string;
  slug: string;
  location: string;
  workplaceType: string;
  jobType: string;
  companyName: string;
  companyVerificationStatus: VerificationStatus;
}

export interface ApplicationCandidateSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface ApplicationItem {
  id: string;
  job: ApplicationJobSummary;
  candidate: ApplicationCandidateSummary;
  resumeUrl: string;
  coverLetter?: string | null;
  phone?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string | null;
}

export interface SubmitApplicationPayload {
  resumeUrl: string;
  coverLetter?: string;
  phone?: string;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
  notes?: string;
}


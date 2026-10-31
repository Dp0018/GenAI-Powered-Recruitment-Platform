import { VerificationStatus } from "@/types/auth";
import { JobItem } from "@/features/jobs/types/job";

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  companySize?: string | null;
  location?: string | null;
  description?: string | null;
  verificationStatus: VerificationStatus;
  activeJobsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCompanyPayload {
  name: string;
  website?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface PublicCompanyDetail {
  company: Company;
  openJobs: JobItem[];
}

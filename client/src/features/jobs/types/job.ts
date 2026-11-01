import { CompanyResponse, PagedResponse } from "@/types/auth";

export interface JobItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string | null;
  location: string;
  workplaceType: "REMOTE" | "HYBRID" | "ONSITE";
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  experienceLevel?: "ENTRY_LEVEL" | "MID_LEVEL" | "SENIOR" | "LEAD" | "EXECUTIVE" | string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency: string;
  tags: string[];
  benefits?: string[];
  expiresAt?: string | null;
  expired?: boolean;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  applicantCount: number;
  company: CompanyResponse;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  requirements?: string;
  location: string;
  workplaceType: string;
  jobType: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  tags?: string[];
  benefits?: string[];
  expirationDays?: number;
  status?: string;
}

export interface SearchJobsParams {
  query?: string;
  location?: string;
  workplaceType?: string;
  jobType?: string;
  experienceLevel?: string;
  minSalary?: number;
  sortBy?: "NEWEST" | "SALARY_DESC" | "SALARY_ASC" | "POPULAR" | string;
  page?: number;
  size?: number;
}

import { CompanyResponse } from "@/types/auth";

export type JobQuestionType = "TEXT" | "BOOLEAN" | "CHOICE";

export interface JobQuestionItem {
  id?: string;
  questionText: string;
  questionType: JobQuestionType;
  required: boolean;
  options: string[];
  orderIndex: number;
}

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
  salaryPeriod?: "YEARLY" | "MONTHLY" | "HOURLY" | string | null;
  hasEquity?: boolean | null;
  equityRange?: string | null;
  hasSignOnBonus?: boolean | null;
  signOnBonus?: number | null;
  annualBonusPercentage?: number | null;
  compensationNotes?: string | null;
  tags: string[];
  benefits?: string[];
  expiresAt?: string | null;
  expired?: boolean;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  applicantCount: number;
  viewsCount?: number;
  fraudRiskScore?: number | null;
  fraudRiskLevel?: string | null;
  fraudReasons?: string | null;
  isQuarantined?: boolean | null;
  company: CompanyResponse;
  screeningQuestions?: JobQuestionItem[];
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
  salaryPeriod?: string;
  hasEquity?: boolean;
  equityRange?: string;
  hasSignOnBonus?: boolean;
  signOnBonus?: number;
  annualBonusPercentage?: number;
  compensationNotes?: string;
  tags?: string[];
  benefits?: string[];
  expirationDays?: number;
  status?: string;
  screeningQuestions?: JobQuestionItem[];
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

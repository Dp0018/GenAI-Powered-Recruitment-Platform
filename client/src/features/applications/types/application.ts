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

export interface ScreeningAnswerItem {
  id?: string;
  questionId?: string;
  questionText: string;
  answerText: string;
}

export interface ApplicationItem {
  id: string;
  job: ApplicationJobSummary;
  candidate: ApplicationCandidateSummary;
  resumeUrl: string;
  coverLetter?: string | null;
  phone?: string | null;
  feedbackNote?: string | null;
  status: ApplicationStatus;
  screeningAnswers?: ScreeningAnswerItem[];
  averageRating?: number | null;
  reviewCount?: number;
  referralCode?: string | null;
  referredBy?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface SubmitApplicationPayload {
  resumeUrl: string;
  coverLetter?: string;
  phone?: string;
  screeningAnswers?: ScreeningAnswerItem[];
  referralCode?: string;
  referredBy?: string;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
  notes?: string;
}


export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";

export interface InterviewItem {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInterviewPayload {
  applicationId: string;
  title: string;
  scheduledAt: string; // ISO string
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
}

export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "PENDING_CANDIDATE_BOOKING";

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
  scheduledAt?: string;
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
  status: InterviewStatus;
  proposedSlots?: string[];
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

export interface ProposeSlotsPayload {
  applicationId: string;
  title: string;
  proposedSlots: string[];
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
}

export interface SelectSlotPayload {
  interviewId: string;
  selectedSlot: string;
}

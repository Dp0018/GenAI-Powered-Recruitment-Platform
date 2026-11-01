export type AlertFrequency = "DAILY" | "WEEKLY";

export interface JobAlertItem {
  id: string;
  candidateId: string;
  candidateEmail: string;
  keyword: string;
  location?: string | null;
  frequency: AlertFrequency;
  active: boolean;
  lastNotifiedAt?: string | null;
  createdAt: string;
}

export interface CreateJobAlertPayload {
  keyword: string;
  location?: string;
  frequency?: AlertFrequency;
}

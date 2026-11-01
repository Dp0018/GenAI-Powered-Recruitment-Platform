export interface CandidateResume {
  id: string;
  candidateId: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType?: string | null;
  fileSize?: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCandidateResumePayload {
  title: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  isDefault?: boolean;
}

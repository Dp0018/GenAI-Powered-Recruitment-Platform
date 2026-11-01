export type OfferStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "SENT"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED";

export interface JobOffer {
  id: string;
  applicationId: string;
  jobId?: string | null;
  companyId?: string | null;
  companyName: string;
  companyLogo?: string | null;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  baseSalary: number;
  currency: string;
  payPeriod: string;
  equityDetails?: string | null;
  signOnBonus?: number | null;
  annualBonusDetails?: string | null;
  startDate?: string | null;
  expiresAt?: string | null;
  expired: boolean;
  status: OfferStatus;
  letterBody: string;
  benefitsSummary?: string | null;
  signatureToken?: string | null;
  signedAt?: string | null;
  signerName?: string | null;
  declinedAt?: string | null;
  declinedReason?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateJobOfferPayload {
  applicationId: string;
  jobTitle: string;
  baseSalary: number;
  currency?: string;
  payPeriod?: string;
  equityDetails?: string;
  signOnBonus?: number;
  annualBonusDetails?: string;
  startDate?: string;
  expirationDays?: number;
  letterBody?: string;
  benefitsSummary?: string;
}

export interface SignOfferPayload {
  signerName: string;
  signatureConsent: boolean;
}

export interface DeclineOfferPayload {
  reason: string;
}

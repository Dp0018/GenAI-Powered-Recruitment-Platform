export interface CandidateProfile {
  id?: string;
  userId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  skills: string[];
  yearsOfExperience?: number;
  currentRole?: string;
  currentCompany?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCandidateProfilePayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  skills?: string[];
  yearsOfExperience?: number;
  currentRole?: string;
  currentCompany?: string;
}

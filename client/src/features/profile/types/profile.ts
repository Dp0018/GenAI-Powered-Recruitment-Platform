export interface WorkExperienceItem {
  id?: string;
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  createdAt?: string;
}

export interface EducationHistoryItem {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  gradeOrGpa?: string;
  description?: string;
  createdAt?: string;
}

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
  workExperiences?: WorkExperienceItem[];
  educationHistory?: EducationHistoryItem[];
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

export interface ParseResumeRequest {
  resumeUrl?: string;
  resumeText?: string;
}

export interface ParsedResumeDto {
  headline?: string;
  bio?: string;
  phone?: string;
  skills?: string[];
  workExperiences?: WorkExperienceItem[];
  educationHistory?: EducationHistoryItem[];
}

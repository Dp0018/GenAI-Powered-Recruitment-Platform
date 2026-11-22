export interface RagCitation {
  sectionType: string;
  title: string;
  snippet: string;
  relevanceScore: number;
}

export interface TalentSearchResult {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  headline: string;
  location: string;
  yearsOfExperience: number;
  resumeUrl: string;
  skills: string[];
  matchPercentage: number;
  executiveSummary: string;
  citations: RagCitation[];
}

export interface TalentSearchResponse {
  query: string;
  talentLandscapeSummary: string;
  totalCandidatesMatched: number;
  candidates: TalentSearchResult[];
}

export interface TalentSearchRequest {
  query: string;
  minYearsExperience?: number;
  requiredSkill?: string;
  limit?: number;
}

export interface RequirementFitItem {
  requirement: string;
  status: "VERIFIED_MATCH" | "PARTIAL_MATCH" | "MISSING_EVIDENCE";
  matchScore: number;
  evidenceCitation: string;
  analysis: string;
}

export interface ResumeJobFitResponse {
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  overallFitScore: number;
  fitGrade: "A+" | "A" | "B" | "C";
  executiveSummary: string;
  requirementsBreakdown: RequirementFitItem[];
  verifiedStrengths: string[];
  identifiedSkillGaps: string[];
  interviewRecommendations: string[];
}

export interface OptimizedBulletOption {
  level: string;
  bulletText: string;
  metricsHighlight: string;
  projectedImpactScore: number;
}

export interface ResumeOptimizeResponse {
  originalBullet: string;
  initialImpactScore: number;
  starFrameworkGrade: "STRONG" | "NEEDS_METRICS" | "PASSIVE_VOICE" | "WEAK";
  critiqueAnalysis: string;
  identifiedWeaknesses: string[];
  optimizedOptions: OptimizedBulletOption[];
  recommendedActionVerbs: string[];
}

export interface ResumeOptimizeRequest {
  bulletText: string;
  targetRole?: string;
  industry?: string;
}

export interface ResumeChatResponse {
  question: string;
  answer: string;
  confidenceGrade: "HIGH_CONFIDENCE" | "MODERATE" | "LOW_EVIDENCE";
  citations: RagCitation[];
}

export interface ResumeChatRequest {
  question: string;
}


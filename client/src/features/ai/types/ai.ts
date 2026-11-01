export interface JobFraudAnalysisResponse {
  fraudScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  isQuarantined: boolean;
  reasons: string[];
  safetyAdvice: string[];
}

export interface ExplainableMatchResponse {
  overallScore: number;
  matchGrade: "EXCELLENT" | "STRONG" | "MODERATE" | "LOW";
  skillsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceScore: number;
  experienceAssessment: string;
  domainScore: number;
  domainAssessment: string;
  workplaceScore: number;
  executiveSummary: string;
  keyStrengths: string[];
  potentialGaps: string[];
  candidateActionableAdvice: string[];
  biasAndFairnessNotice: string;
}

export interface ResumeAnomalyScanResponse {
  anomalyScore: number;
  riskLevel: "CLEAN" | "SUSPICIOUS" | "FLAGGED";
  promptInjectionDetected: boolean;
  detectedAnomalies: string[];
  assessmentSummary: string;
}

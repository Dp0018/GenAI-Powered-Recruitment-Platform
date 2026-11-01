export type FitCategory = "EXCELLENT_MATCH" | "STRONG_FIT" | "MODERATE_FIT" | "LOW_FIT";

export interface SkillsMatchResponse {
  score: number;
  fitCategory: FitCategory;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

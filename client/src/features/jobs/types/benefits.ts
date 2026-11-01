export interface BenefitMeta {
  key: string;
  label: string;
  category: "HEALTH" | "FINANCIAL" | "FLEXIBILITY" | "GROWTH" | "WELLNESS";
  description: string;
}

export const COMPANY_BENEFITS: BenefitMeta[] = [
  {
    key: "HEALTH_INSURANCE",
    label: "Health, Dental & Vision",
    category: "HEALTH",
    description: "Comprehensive medical, dental, and vision coverage for you and dependents",
  },
  {
    key: "RETIREMENT_401K",
    label: "401(k) / Pension Match",
    category: "FINANCIAL",
    description: "Company-sponsored retirement contributions and matching plans",
  },
  {
    key: "UNLIMITED_PTO",
    label: "Unlimited Paid Time Off",
    category: "FLEXIBILITY",
    description: "Flexible, outcome-driven time off policy with paid company holidays",
  },
  {
    key: "EQUITY",
    label: "Stock Options & Equity",
    category: "FINANCIAL",
    description: "Meaningful equity ownership and employee stock purchase programs",
  },
  {
    key: "REMOTE_STIPEND",
    label: "Home Office Stipend",
    category: "FLEXIBILITY",
    description: "Allowance for ergonomic desks, monitors, and high-speed internet",
  },
  {
    key: "LEARNING_BUDGET",
    label: "Learning & Dev Budget",
    category: "GROWTH",
    description: "Annual stipend for conferences, books, courses, and certifications",
  },
  {
    key: "FLEXIBLE_HOURS",
    label: "Flexible Working Hours",
    category: "FLEXIBILITY",
    description: "Asynchronous work environment with core overlap hours",
  },
  {
    key: "GYM_WELLNESS",
    label: "Gym & Wellness Subsidy",
    category: "WELLNESS",
    description: "Monthly allowance for gym memberships, therapy, and fitness activities",
  },
  {
    key: "PARENTAL_LEAVE",
    label: "Paid Parental Leave",
    category: "HEALTH",
    description: "Generous paid leave for new parents, birth, adoption, or foster",
  },
  {
    key: "COMMUTER_BENEFITS",
    label: "Commuter & Transit Pass",
    category: "FINANCIAL",
    description: "Pre-tax transit passes or subsidized public transportation passes",
  },
];

export function getBenefitLabel(key: string): string {
  const found = COMPANY_BENEFITS.find((b) => b.key === key);
  return found ? found.label : key.replace(/_/g, " ");
}

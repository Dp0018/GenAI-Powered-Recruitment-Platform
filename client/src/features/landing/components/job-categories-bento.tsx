"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code2,
  Cpu,
  Layers,
  Cloud,
  Database,
  Palette,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface CategoryCard {
  id: string;
  title: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
  jobCount: string;
  salaryRange: string;
  skills: string[];
}

const CATEGORIES: CategoryCard[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    query: "Software Engineer",
    icon: Code2,
    jobCount: "3,480+ roles",
    salaryRange: "$120k - $240k",
    skills: ["React", "TypeScript", "Go", "Java"],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    query: "AI Engineer",
    icon: Cpu,
    jobCount: "1,240+ roles",
    salaryRange: "$150k - $290k",
    skills: ["LLMs", "Python", "PyTorch", "RAG"],
  },
  {
    id: "product-management",
    title: "Product Management",
    query: "Product Manager",
    icon: Layers,
    jobCount: "860+ roles",
    salaryRange: "$130k - $215k",
    skills: ["Roadmapping", "Growth", "Agile", "Analytics"],
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    query: "DevOps",
    icon: Cloud,
    jobCount: "940+ roles",
    salaryRange: "$135k - $225k",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
  },
  {
    id: "data-analytics",
    title: "Data Science & Analytics",
    query: "Data Engineer",
    icon: Database,
    jobCount: "780+ roles",
    salaryRange: "$115k - $205k",
    skills: ["SQL", "Snowflake", "dbt", "PostgreSQL"],
  },
  {
    id: "design-ux",
    title: "Product Design & UX",
    query: "Product Designer",
    icon: Palette,
    jobCount: "620+ roles",
    salaryRange: "$110k - $185k",
    skills: ["Figma", "Design Systems", "Prototyping", "UX"],
  },
  {
    id: "security",
    title: "Cybersecurity",
    query: "Security Engineer",
    icon: ShieldCheck,
    jobCount: "430+ roles",
    salaryRange: "$140k - $230k",
    skills: ["AppSec", "Compliance", "SOC2", "Cloud Sec"],
  },
  {
    id: "sales-growth",
    title: "Sales & Account Execs",
    query: "Account Executive",
    icon: TrendingUp,
    jobCount: "510+ roles",
    salaryRange: "$90k - $190k",
    skills: ["B2B SaaS", "Enterprise", "Outbound", "CRM"],
  },
];

export function JobCategoriesBento() {
  const router = useRouter();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-background">
      <div className="container mx-auto max-w-6xl space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Explore Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Browse roles by category
            </h2>
            <p className="text-sm text-muted-foreground">
              Discover openings across fields with verified salary ranges.
            </p>
          </div>

          <Link href="/jobs">
            <button className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group cursor-pointer">
              <span>View all jobs</span>
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => router.push(`/jobs?query=${encodeURIComponent(cat.query)}`)}
                className="p-5 rounded-xl bg-card border border-border/80 hover:border-primary/40 transition-colors cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                    <IconComponent className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {cat.jobCount} • Avg {cat.salaryRange}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-secondary text-[11px] text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

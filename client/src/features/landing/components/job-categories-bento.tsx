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
  Sparkles,
} from "lucide-react";

interface CategoryCard {
  id: string;
  title: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
  jobCount: string;
  salaryRange: string;
  skills: string[];
  isHot?: boolean;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    query: "Software Engineer",
    icon: Code2,
    jobCount: "3,480+ Jobs",
    salaryRange: "$120k - $240k",
    skills: ["React", "TypeScript", "Go", "Java"],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    query: "AI Engineer",
    icon: Cpu,
    jobCount: "1,240+ Jobs",
    salaryRange: "$150k - $290k",
    skills: ["LLMs", "Python", "PyTorch", "RAG"],
    isHot: true,
  },
  {
    id: "product-management",
    title: "Product Management",
    query: "Product Manager",
    icon: Layers,
    jobCount: "860+ Jobs",
    salaryRange: "$130k - $215k",
    skills: ["Roadmapping", "Growth", "Agile", "Analytics"],
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    query: "DevOps",
    icon: Cloud,
    jobCount: "940+ Jobs",
    salaryRange: "$135k - $225k",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
  },
  {
    id: "data-analytics",
    title: "Data Science & Analytics",
    query: "Data Engineer",
    icon: Database,
    jobCount: "780+ Jobs",
    salaryRange: "$115k - $205k",
    skills: ["SQL", "Snowflake", "dbt", "PostgreSQL"],
  },
  {
    id: "design-ux",
    title: "Product Design & UX",
    query: "Product Designer",
    icon: Palette,
    jobCount: "620+ Jobs",
    salaryRange: "$110k - $185k",
    skills: ["Figma", "Design Systems", "Prototyping", "UX"],
  },
  {
    id: "security",
    title: "Cybersecurity & Infosec",
    query: "Security Engineer",
    icon: ShieldCheck,
    jobCount: "430+ Jobs",
    salaryRange: "$140k - $230k",
    skills: ["AppSec", "Compliance", "SOC2", "Cloud Sec"],
  },
  {
    id: "sales-growth",
    title: "Sales & Growth",
    query: "Account Executive",
    icon: TrendingUp,
    jobCount: "510+ Jobs",
    salaryRange: "$90k - $190k + OTE",
    skills: ["B2B SaaS", "Enterprise", "Outbound", "CRM"],
  },
];

export function JobCategoriesBento() {
  const router = useRouter();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-background">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span>Explore Top Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Browse Roles by Category
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Discover openings across the most in-demand fields with verified salary benchmarks.
            </p>
          </div>

          <Link href="/jobs">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group cursor-pointer">
              <span>View all openings</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => router.push(`/jobs?query=${encodeURIComponent(cat.query)}`)}
                className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-md transition-all space-y-4 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComponent className="size-5" />
                    </div>
                    {cat.isHot && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        🔥 High Demand
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {cat.jobCount} • Avg {cat.salaryRange}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-mono text-secondary-foreground"
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

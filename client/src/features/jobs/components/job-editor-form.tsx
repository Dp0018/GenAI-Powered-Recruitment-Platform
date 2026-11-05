"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateJobMutation, useUpdateJobMutation } from "../hooks/use-jobs";
import { COMPANY_BENEFITS } from "../types/benefits";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Sparkles,
  Loader2,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { JobItem, JobQuestionItem } from "../types/job";
import { JobScreeningQuestionsBuilder } from "./job-screening-questions-builder";
import { JobDescriptionEditor } from "./job-description-editor";

interface JobEditorFormProps {
  mode: "create" | "edit";
  initialJob?: Partial<JobItem> | null;
  jobId?: string;
}

export function JobEditorForm({ mode, initialJob, jobId }: JobEditorFormProps) {
  const router = useRouter();

  // Basic Details
  const [title, setTitle] = useState(initialJob?.title || "");
  const [description, setDescription] = useState(initialJob?.description || "");
  const [requirements, setRequirements] = useState(initialJob?.requirements || "");
  const [location, setLocation] = useState(initialJob?.location || "");
  const [workplaceType, setWorkplaceType] = useState<string>(
    initialJob?.workplaceType || "REMOTE"
  );
  const [jobType, setJobType] = useState<string>(
    initialJob?.jobType || "FULL_TIME"
  );
  const [experienceLevel, setExperienceLevel] = useState<string>(
    initialJob?.experienceLevel || "MID_LEVEL"
  );
  const [status, setStatus] = useState<"PUBLISHED" | "CLOSED" | "DRAFT">(
    (initialJob?.status as "PUBLISHED" | "CLOSED" | "DRAFT") || "PUBLISHED"
  );

  // Compensation
  const [minSalary, setMinSalary] = useState(
    initialJob?.minSalary ? String(initialJob.minSalary) : ""
  );
  const [maxSalary, setMaxSalary] = useState(
    initialJob?.maxSalary ? String(initialJob.maxSalary) : ""
  );
  const [currency] = useState(initialJob?.currency || "GBP");
  const [salaryPeriod, setSalaryPeriod] = useState<string>(
    initialJob?.salaryPeriod || "YEARLY"
  );
  const [hasEquity, setHasEquity] = useState(Boolean(initialJob?.hasEquity));
  const [equityRange, setEquityRange] = useState(initialJob?.equityRange || "");
  const [hasSignOnBonus, setHasSignOnBonus] = useState(
    Boolean(initialJob?.hasSignOnBonus)
  );
  const [signOnBonus, setSignOnBonus] = useState(
    initialJob?.signOnBonus ? String(initialJob.signOnBonus) : ""
  );
  const [annualBonusPercentage, setAnnualBonusPercentage] = useState(
    initialJob?.annualBonusPercentage
      ? String(initialJob.annualBonusPercentage)
      : ""
  );
  const [compensationNotes, setCompensationNotes] = useState(
    initialJob?.compensationNotes || ""
  );

  // Tags & Benefits
  const [tagsInput, setTagsInput] = useState(
    initialJob?.tags ? initialJob.tags.join(", ") : ""
  );
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(
    initialJob?.benefits || []
  );

  // Expiration / Close Date Management
  const initialDays = useMemo(() => {
    if (initialJob?.expiresAt) {
      const diffMs = new Date(initialJob.expiresAt).getTime() - Date.now();
      const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      return String(diffDays);
    }
    return "30";
  }, [initialJob?.expiresAt]);

  const [expirationPreset, setExpirationPreset] = useState<string>(() => {
    if (["2", "7", "14", "17", "30", "60", "90"].includes(initialDays)) {
      return initialDays;
    }
    return initialJob?.expiresAt ? "custom" : "30";
  });

  const [customDays, setCustomDays] = useState<string>(initialDays);
  const [customDate, setCustomDate] = useState<string>(() => {
    if (initialJob?.expiresAt) {
      try {
        return new Date(initialJob.expiresAt).toISOString().split("T")[0];
      } catch {
        return "";
      }
    }
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  // Effective days count to submit
  const effectiveExpirationDays = useMemo<number | undefined>(() => {
    if (expirationPreset === "none") return undefined;
    if (expirationPreset === "custom") {
      const parsed = parseInt(customDays, 10);
      return !isNaN(parsed) && parsed > 0 ? parsed : undefined;
    }
    const parsedPreset = parseInt(expirationPreset, 10);
    return !isNaN(parsedPreset) && parsedPreset > 0 ? parsedPreset : undefined;
  }, [expirationPreset, customDays]);

  // Live computed close date label
  const targetCloseDateLabel = useMemo(() => {
    if (expirationPreset === "none" || !effectiveExpirationDays) {
      return "Open indefinitely (until closed manually)";
    }
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + effectiveExpirationDays);
    return `Closes ${targetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} (in ${effectiveExpirationDays}d)`;
  }, [expirationPreset, effectiveExpirationDays]);

  // Screening Questions
  const [screeningQuestions, setScreeningQuestions] = useState<
    JobQuestionItem[]
  >(initialJob?.screeningQuestions || []);

  // Mutations
  const createMutation = useCreateJobMutation(() => {
    router.push("/dashboard/employer");
  });

  const updateMutation = useUpdateJobMutation(() => {
    router.push("/dashboard/employer");
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const toggleBenefit = (key: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCustomDateChange = (dateStr: string) => {
    setCustomDate(dateStr);
    if (!dateStr) return;
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = selected.getTime() - today.getTime();
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    setCustomDays(String(diffDays));
    setExpirationPreset("custom");
  };

  const handleCustomDaysChange = (daysStr: string) => {
    setCustomDays(daysStr);
    const days = parseInt(daysStr, 10);
    if (!isNaN(days) && days > 0) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      setCustomDate(d.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error("Please fill in Title, Description, and Location");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.trim() || undefined,
      location: location.trim(),
      workplaceType,
      jobType,
      experienceLevel,
      minSalary: minSalary ? parseInt(minSalary, 10) : undefined,
      maxSalary: maxSalary ? parseInt(maxSalary, 10) : undefined,
      currency,
      salaryPeriod,
      hasEquity,
      equityRange: hasEquity && equityRange.trim() ? equityRange.trim() : undefined,
      hasSignOnBonus,
      signOnBonus:
        hasSignOnBonus && signOnBonus ? parseInt(signOnBonus, 10) : undefined,
      annualBonusPercentage: annualBonusPercentage
        ? parseFloat(annualBonusPercentage)
        : undefined,
      compensationNotes: compensationNotes.trim() || undefined,
      tags,
      benefits: selectedBenefits,
      expirationDays: effectiveExpirationDays,
      status,
      screeningQuestions:
        screeningQuestions.length > 0 ? screeningQuestions : undefined,
    };

    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (mode === "edit" && jobId) {
      updateMutation.mutate({ id: jobId, payload });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Sleek Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <Link
            href="/dashboard/employer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {mode === "create" ? "Post a New Job Opening" : "Edit Job Opening"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === "create"
              ? "Draft your job specifications, set compensation, and publish to verified candidates."
              : "Update requirements, close dates, compensation, or pre-screening questions."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/dashboard/employer">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs rounded-xl border-border hover:bg-secondary"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="job-editor-form"
            disabled={isSubmitting}
            size="sm"
            className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-xl shadow-xs cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                {mode === "create" ? "Publishing..." : "Saving..."}
              </>
            ) : mode === "create" ? (
              "Publish Job"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <form
        id="job-editor-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Left Column: Core Job Narrative (~65% width on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Role Overview */}
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Role Specifications
                </h2>
              </div>
              {mode === "edit" && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="status" className="text-xs text-muted-foreground font-mono">
                    Status:
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "PUBLISHED" | "CLOSED" | "DRAFT")
                    }
                    className="h-8 bg-background border border-border text-foreground text-xs rounded-lg px-2.5 font-mono cursor-pointer"
                  >
                    <option value="PUBLISHED">Published (Accepting)</option>
                    <option value="CLOSED">Closed (Archived)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium text-foreground">
                Job Title <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="title"
                required
                placeholder="e.g. Senior Backend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-sm font-medium bg-background border-border text-foreground rounded-xl focus-visible:ring-primary"
              />
            </div>

            {/* 2x2 Grid for Location, Workplace, Type, Seniority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-medium text-foreground">
                  Primary Location <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="location"
                  required
                  placeholder="e.g. London, UK or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9.5 text-xs bg-background border-border text-foreground rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="workplaceType" className="text-xs font-medium text-foreground">
                  Workplace Policy
                </Label>
                <select
                  id="workplaceType"
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full h-9.5 text-xs bg-background border border-border text-foreground rounded-xl px-3 cursor-pointer"
                >
                  <option value="REMOTE">Fully Remote</option>
                  <option value="HYBRID">Hybrid (Flexible)</option>
                  <option value="ONSITE">On-Site / In-Office</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="jobType" className="text-xs font-medium text-foreground">
                  Employment Type
                </Label>
                <select
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full h-9.5 text-xs bg-background border border-border text-foreground rounded-xl px-3 cursor-pointer"
                >
                  <option value="FULL_TIME">Full-time Employee</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract / Freelance</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="experienceLevel" className="text-xs font-medium text-foreground">
                  Seniority Level
                </Label>
                <select
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full h-9.5 text-xs bg-background border border-border text-foreground rounded-xl px-3 cursor-pointer"
                >
                  <option value="ENTRY_LEVEL">Entry Level (0–2 yrs)</option>
                  <option value="MID_LEVEL">Mid Level (3–5 yrs)</option>
                  <option value="SENIOR">Senior (5–8 yrs)</option>
                  <option value="LEAD">Staff / Lead (8+ yrs)</option>
                  <option value="EXECUTIVE">Executive / Director</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Role Description & Requirements */}
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-foreground">
                  Role Description & Requirements
                </h2>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                AI Description Assist
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Job Description <span className="text-rose-400">*</span>
              </Label>
              <JobDescriptionEditor
                value={description}
                onChange={setDescription}
                jobTitle={title}
                placeholder="Outline the core responsibilities, team structure, and day-to-day impact..."
                minHeight="220px"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="requirements" className="text-xs font-medium text-foreground">
                Key Requirements & Qualifications
              </Label>
              <Textarea
                id="requirements"
                rows={4}
                placeholder="• 4+ years building production backend services&#10;• Experience with distributed systems and cloud infra&#10;• Strong communication and team mentorship"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="text-xs bg-background border-border text-foreground rounded-xl resize-y"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="tagsInput" className="text-xs font-medium text-foreground">
                Key Skills & Keyword Tags (Comma Separated)
              </Label>
              <Input
                id="tagsInput"
                placeholder="e.g. Java, Kubernetes, Kafka, Distributed Systems, AWS"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="h-9.5 text-xs bg-background border-border text-foreground rounded-xl"
              />
              <p className="text-[11px] text-muted-foreground font-mono">
                Used to compute AI match scores and candidate skill gap analysis.
              </p>
            </div>
          </div>

          {/* Card 3: Screening Questions */}
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <HelpCircle className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Pre-Screening Questions
                </h2>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {screeningQuestions.length} Question{screeningQuestions.length === 1 ? "" : "s"}
              </span>
            </div>

            <JobScreeningQuestionsBuilder
              questions={screeningQuestions}
              onChange={setScreeningQuestions}
            />
          </div>
        </div>

        {/* Right Sidebar: Timeline, Compensation, Benefits & Submit (~35% width on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sidebar Card 1: Job Close Date & Timeline */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/70">
              <Clock className="size-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-foreground">
                Close Date & Timeline
              </h2>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">
                Choose Duration Preset:
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: "2 Days", value: "2", tag: "Flash" },
                  { label: "7 Days", value: "7", tag: "1W" },
                  { label: "14 Days", value: "14", tag: "2W" },
                  { label: "17 Days", value: "17", tag: "Sprint" },
                  { label: "30 Days", value: "30", tag: "1M" },
                  { label: "Ongoing", value: "none", tag: "No limit" },
                ].map((p) => {
                  const isSelected = expirationPreset === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setExpirationPreset(p.value);
                        if (p.value !== "none") {
                          setCustomDays(p.value);
                          const d = new Date();
                          d.setDate(d.getDate() + parseInt(p.value, 10));
                          setCustomDate(d.toISOString().split("T")[0]);
                        }
                      }}
                      className={`px-2 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                          : "bg-secondary/40 hover:bg-secondary text-foreground border-border"
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{p.label}</div>
                      <div
                        className={`text-[9px] font-mono ${
                          isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {p.tag}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Exact Date or Custom Days Inputs */}
              <div className="pt-2 border-t border-border/60 space-y-2.5">
                <span className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="size-3 text-muted-foreground" />
                  <span>Custom Days or Exact Date</span>
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      htmlFor="customDays"
                      className="text-[10px] text-muted-foreground block mb-1"
                    >
                      Days Open:
                    </Label>
                    <div className="flex items-center gap-1">
                      <Input
                        id="customDays"
                        type="number"
                        min="1"
                        max="365"
                        placeholder="e.g. 17"
                        value={customDays}
                        onChange={(e) => {
                          setExpirationPreset("custom");
                          handleCustomDaysChange(e.target.value);
                        }}
                        className="h-8.5 text-xs bg-background border-border text-foreground rounded-lg font-mono"
                      />
                      <span className="text-[10px] text-muted-foreground font-mono">d</span>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="customDate"
                      className="text-[10px] text-muted-foreground block mb-1"
                    >
                      Calendar Date:
                    </Label>
                    <Input
                      id="customDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={customDate}
                      onChange={(e) => handleCustomDateChange(e.target.value)}
                      className="h-8.5 text-[11px] bg-background border-border text-foreground rounded-lg font-mono cursor-pointer px-2"
                    />
                  </div>
                </div>

                {/* Status Notice */}
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/70 flex items-start gap-2 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{targetCloseDateLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Card 2: Compensation Band */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/70">
              <DollarSign className="size-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-foreground">
                Compensation Band
              </h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="minSalary" className="text-[11px] text-muted-foreground">
                    Min Base ({currency})
                  </Label>
                  <Input
                    id="minSalary"
                    type="number"
                    placeholder="75000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="h-9 text-xs bg-background border-border text-foreground rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="maxSalary" className="text-[11px] text-muted-foreground">
                    Max Base ({currency})
                  </Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    placeholder="110000"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="h-9 text-xs bg-background border-border text-foreground rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="salaryPeriod" className="text-[11px] text-muted-foreground">
                  Frequency
                </Label>
                <select
                  id="salaryPeriod"
                  value={salaryPeriod}
                  onChange={(e) => setSalaryPeriod(e.target.value)}
                  className="w-full h-8.5 text-xs bg-background border border-border text-foreground rounded-lg px-2.5 cursor-pointer font-mono"
                >
                  <option value="YEARLY">Annual (Per Year)</option>
                  <option value="MONTHLY">Monthly (Per Month)</option>
                  <option value="HOURLY">Hourly (Per Hour)</option>
                </select>
              </div>

              {/* Equity & Bonuses Toggle */}
              <div className="pt-2 border-t border-border/60 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={hasEquity}
                    onChange={(e) => setHasEquity(e.target.checked)}
                    className="size-3.5 rounded accent-primary cursor-pointer"
                  />
                  <span>Includes Stock / Equity</span>
                </label>
                {hasEquity && (
                  <Input
                    placeholder="e.g. 0.1% – 0.5% or 5,000 RSUs"
                    value={equityRange}
                    onChange={(e) => setEquityRange(e.target.value)}
                    className="h-8 text-xs bg-background border-border text-foreground rounded-lg"
                  />
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={hasSignOnBonus}
                    onChange={(e) => setHasSignOnBonus(e.target.checked)}
                    className="size-3.5 rounded accent-primary cursor-pointer"
                  />
                  <span>Sign-on Bonus</span>
                </label>
                {hasSignOnBonus && (
                  <Input
                    type="number"
                    placeholder={`Amount in ${currency} (e.g. 10000)`}
                    value={signOnBonus}
                    onChange={(e) => setSignOnBonus(e.target.value)}
                    className="h-8 text-xs bg-background border-border text-foreground rounded-lg font-mono"
                  />
                )}

                <div className="space-y-1 pt-1">
                  <Label
                    htmlFor="compensationNotes"
                    className="text-[10px] text-muted-foreground"
                  >
                    Compensation Notes (Optional)
                  </Label>
                  <Input
                    id="compensationNotes"
                    placeholder="e.g. Calibrated based on location & depth"
                    value={compensationNotes}
                    onChange={(e) => setCompensationNotes(e.target.value)}
                    className="h-8 text-xs bg-background border-border text-foreground rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Card 3: Benefits & Perks */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-foreground">
                  Benefits & Perks
                </h2>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {selectedBenefits.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMPANY_BENEFITS.map((b) => {
                const isSelected = selectedBenefits.includes(b.key);
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => toggleBenefit(b.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-primary/20 text-primary border border-primary/40 font-semibold"
                        : "bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="size-3 text-primary shrink-0" />
                    )}
                    <span>{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Card 4: Primary Submit Action */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  {mode === "create" ? "Publishing Job..." : "Saving Changes..."}
                </>
              ) : mode === "create" ? (
                "Publish Job Opening"
              ) : (
                "Save Changes"
              )}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              {mode === "create"
                ? "Your opening will be immediately indexed and matched with verified candidates."
                : "Edits take effect immediately across all applicant views."}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

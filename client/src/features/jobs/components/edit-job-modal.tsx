"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateJobMutation } from "../hooks/use-jobs";
import { JobItem, JobQuestionItem } from "../types/job";
import { COMPANY_BENEFITS } from "../types/benefits";
import { Loader2, Edit3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { JobScreeningQuestionsBuilder } from "./job-screening-questions-builder";
import { JobDescriptionEditor } from "./job-description-editor";

interface EditJobModalProps {
  job: JobItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditJobModal({ job, open, onOpenChange }: EditJobModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [workplaceType, setWorkplaceType] = useState("REMOTE");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = useState("MID_LEVEL");
  const [status, setStatus] = useState<"PUBLISHED" | "CLOSED" | "DRAFT">("PUBLISHED");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState<string>("YEARLY");
  const [hasEquity, setHasEquity] = useState(false);
  const [equityRange, setEquityRange] = useState("");
  const [hasSignOnBonus, setHasSignOnBonus] = useState(false);
  const [signOnBonus, setSignOnBonus] = useState("");
  const [annualBonusPercentage, setAnnualBonusPercentage] = useState("");
  const [compensationNotes, setCompensationNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [expirationDays, setExpirationDays] = useState<string>("30");
  const [screeningQuestions, setScreeningQuestions] = useState<JobQuestionItem[]>([]);

  useEffect(() => {
    if (job) {
      setTitle(job.title || "");
      setDescription(job.description || "");
      setRequirements(job.requirements || "");
      setLocation(job.location || "");
      setWorkplaceType(job.workplaceType || "REMOTE");
      setJobType(job.jobType || "FULL_TIME");
      setExperienceLevel(job.experienceLevel || "MID_LEVEL");
      setStatus(job.status || "PUBLISHED");
      setMinSalary(job.minSalary ? String(job.minSalary) : "");
      setMaxSalary(job.maxSalary ? String(job.maxSalary) : "");
      setSalaryPeriod(job.salaryPeriod || "YEARLY");
      setHasEquity(!!job.hasEquity);
      setEquityRange(job.equityRange || "");
      setHasSignOnBonus(!!job.hasSignOnBonus);
      setSignOnBonus(job.signOnBonus ? String(job.signOnBonus) : "");
      setAnnualBonusPercentage(job.annualBonusPercentage ? String(job.annualBonusPercentage) : "");
      setCompensationNotes(job.compensationNotes || "");
      setTagsInput(job.tags?.join(", ") || "");
      setSelectedBenefits(job.benefits || []);
      setExpirationDays("30");
      setScreeningQuestions(job.screeningQuestions || []);
    }
  }, [job]);

  const updateMutation = useUpdateJobMutation(() => {
    onOpenChange(false);
  });

  const toggleBenefit = (key: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error("Please fill in Title, Description, and Location");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const expDays = expirationDays === "none" ? 0 : parseInt(expirationDays, 10);

    updateMutation.mutate({
      id: job.id,
      payload: {
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.trim() || undefined,
        location: location.trim(),
        workplaceType,
        jobType,
        experienceLevel,
        status,
        minSalary: minSalary ? parseInt(minSalary, 10) : undefined,
        maxSalary: maxSalary ? parseInt(maxSalary, 10) : undefined,
        currency: job.currency || "GBP",
        salaryPeriod,
        hasEquity,
        equityRange: hasEquity && equityRange.trim() ? equityRange.trim() : undefined,
        hasSignOnBonus,
        signOnBonus: hasSignOnBonus && signOnBonus ? parseInt(signOnBonus, 10) : undefined,
        annualBonusPercentage: annualBonusPercentage ? parseFloat(annualBonusPercentage) : undefined,
        compensationNotes: compensationNotes.trim() || undefined,
        tags,
        benefits: selectedBenefits,
        expirationDays: isNaN(expDays) ? undefined : expDays,
        screeningQuestions: screeningQuestions.length > 0 ? screeningQuestions : undefined,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar bg-card border border-border text-foreground p-6 sm:p-8 rounded-xl shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <Edit3 className="size-3 text-primary" />
            <span>Job Management</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Edit Job Posting
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Update role specifications, compensation, perks, or lifecycle status.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div className="space-y-1 text-left">
            <Label htmlFor="edit-title" className="text-xs font-medium text-foreground">
              Role Title *
            </Label>
            <Input
              id="edit-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="edit-location" className="text-xs font-medium text-foreground">
                Location *
              </Label>
              <Input
                id="edit-location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-workplaceType" className="text-xs font-medium text-foreground">
                Workplace
              </Label>
              <select
                id="edit-workplaceType"
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-hidden focus:border-primary"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-jobType" className="text-xs font-medium text-foreground">
                Employment
              </Label>
              <select
                id="edit-jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-hidden focus:border-primary"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="space-y-1">
              <Label htmlFor="edit-exp" className="text-xs font-medium text-foreground">
                Experience Level
              </Label>
              <select
                id="edit-exp"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-hidden focus:border-primary"
              >
                <option value="ENTRY_LEVEL">Entry Level (0-2 yrs)</option>
                <option value="MID_LEVEL">Mid Level (3-5 yrs)</option>
                <option value="SENIOR">Senior (5-8 yrs)</option>
                <option value="LEAD">Staff / Lead (8+ yrs)</option>
                <option value="EXECUTIVE">Executive / VP</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-status" className="text-xs font-medium text-foreground">
                Job Status
              </Label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "PUBLISHED" | "CLOSED" | "DRAFT")}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-hidden focus:border-primary"
              >
                <option value="PUBLISHED">Published (Accepting)</option>
                <option value="CLOSED">Closed (Archived)</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-expiration" className="text-xs font-medium text-foreground">
                Re-extend Expiration
              </Label>
              <select
                id="edit-expiration"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-hidden focus:border-primary"
              >
                <option value="2">+2 Days from now (Urgent)</option>
                <option value="7">+7 Days from now (1 Week)</option>
                <option value="14">+14 Days from now (2 Weeks)</option>
                <option value="17">+17 Days from now (Custom)</option>
                <option value="30">+30 Days from now (Month)</option>
                <option value="60">+60 Days from now</option>
                <option value="90">+90 Days from now</option>
                <option value="none">No Expiration (Indefinite)</option>
              </select>
            </div>
          </div>

          {/* Pay Transparency & Total Rewards Band */}
          <div className="p-3.5 rounded-lg bg-secondary/30 border border-border space-y-3 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>Pay Transparency & Compensation Band</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-normal">
                    Legal Compliance
                  </span>
                </span>
                <p className="text-[11px] text-muted-foreground pt-0.5">
                  Structured base range & variable incentives complying with modern transparency statutes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="edit-minSalary" className="text-[11px] font-medium text-foreground">
                  Min Base
                </Label>
                <Input
                  id="edit-minSalary"
                  type="number"
                  placeholder="140000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-maxSalary" className="text-[11px] font-medium text-foreground">
                  Max Base
                </Label>
                <Input
                  id="edit-maxSalary"
                  type="number"
                  placeholder="195000"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-salaryPeriod" className="text-[11px] font-medium text-foreground">
                  Pay Period
                </Label>
                <select
                  id="edit-salaryPeriod"
                  value={salaryPeriod}
                  onChange={(e) => setSalaryPeriod(e.target.value)}
                  className="w-full h-9 bg-background border border-border text-foreground text-xs rounded-md px-2 focus:outline-hidden focus:border-primary"
                >
                  <option value="YEARLY">Yearly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="HOURLY">Hourly</option>
                </select>
              </div>
            </div>

            {/* Equity & Sign-on Bonuses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/50">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={hasEquity}
                    onChange={(e) => setHasEquity(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-3.5"
                  />
                  <span>Includes Equity / Stock Options</span>
                </label>
                {hasEquity && (
                  <Input
                    placeholder="e.g. 0.05% - 0.12% or 10,000 RSUs"
                    value={equityRange}
                    onChange={(e) => setEquityRange(e.target.value)}
                    className="h-8 bg-background border-border text-foreground text-xs rounded-md"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={hasSignOnBonus}
                    onChange={(e) => setHasSignOnBonus(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-3.5"
                  />
                  <span>Includes Sign-On Bonus</span>
                </label>
                {hasSignOnBonus && (
                  <Input
                    type="number"
                    placeholder="Sign-on amount (£)"
                    value={signOnBonus}
                    onChange={(e) => setSignOnBonus(e.target.value)}
                    className="h-8 bg-background border-border text-foreground text-xs rounded-md"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/50">
              <div className="space-y-1">
                <Label htmlFor="edit-annualBonusPercentage" className="text-[11px] font-medium text-foreground">
                  Annual Target Incentive (%)
                </Label>
                <Input
                  id="edit-annualBonusPercentage"
                  type="number"
                  placeholder="e.g. 15 for 15%"
                  value={annualBonusPercentage}
                  onChange={(e) => setAnnualBonusPercentage(e.target.value)}
                  className="h-8 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-compensationNotes" className="text-[11px] font-medium text-foreground">
                  Transparency Disclosure Note
                </Label>
                <Input
                  id="edit-compensationNotes"
                  placeholder="e.g. Disclosed range covers CA & NYC bands"
                  value={compensationNotes}
                  onChange={(e) => setCompensationNotes(e.target.value)}
                  className="h-8 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <Label htmlFor="edit-tags" className="text-xs font-medium text-foreground">
              Skills & Tech Tags (comma separated)
            </Label>
            <Input
              id="edit-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
            />
          </div>

          {/* Perks & Benefits Badges Multi-select */}
          <div className="space-y-2 text-left pt-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <Label className="text-xs font-semibold text-foreground">
                Perks & Benefits Badges
              </Label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select key benefits included with this role to highlight on public job cards.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {COMPANY_BENEFITS.map((b) => {
                const isSelected = selectedBenefits.includes(b.key);
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => toggleBenefit(b.key)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-secondary/60 hover:bg-secondary text-muted-foreground border-border"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-foreground">
                Job Description (TipTap Rich Editor) *
              </Label>
              <span className="text-[10px] font-mono text-muted-foreground">
                Supports Bold, Lists, Headings & AI Drafting
              </span>
            </div>
            <JobDescriptionEditor
              value={description}
              onChange={setDescription}
              jobTitle={title}
              placeholder="Outline the core responsibilities, team structure, and impact of this role..."
              minHeight="180px"
            />
          </div>

          <div className="space-y-1 text-left">
            <Label htmlFor="edit-reqs" className="text-xs font-medium text-foreground">
              Key Requirements & Qualifications
            </Label>
            <Textarea
              id="edit-reqs"
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
            />
          </div>

          <JobScreeningQuestionsBuilder
            questions={screeningQuestions}
            onChange={setScreeningQuestions}
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-muted-foreground hover:text-foreground text-xs rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              size="sm"
              className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm shadow-primary/20"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

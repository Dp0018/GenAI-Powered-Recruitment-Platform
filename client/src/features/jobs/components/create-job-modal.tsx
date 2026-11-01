"use client";

import React, { useState } from "react";
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
import { useCreateJobMutation } from "../hooks/use-jobs";
import { COMPANY_BENEFITS } from "../types/benefits";
import { Plus, Loader2, Briefcase, MapPin, DollarSign, Tag, Building2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { JobItem, JobQuestionItem } from "../types/job";
import { JobScreeningQuestionsBuilder } from "./job-screening-questions-builder";

interface CreateJobModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactNode;
  initialValues?: Partial<JobItem> | null;
}

export function CreateJobModal({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  triggerButton,
  initialValues,
}: CreateJobModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [workplaceType, setWorkplaceType] = useState("REMOTE");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = useState("MID_LEVEL");
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

  React.useEffect(() => {
    if (initialValues && open) {
      setTitle(initialValues.title ? `Copy of ${initialValues.title}` : "");
      setDescription(initialValues.description || "");
      setRequirements(initialValues.requirements || "");
      setLocation(initialValues.location || "");
      setWorkplaceType(initialValues.workplaceType || "REMOTE");
      setJobType(initialValues.jobType || "FULL_TIME");
      setExperienceLevel(initialValues.experienceLevel || "MID_LEVEL");
      setMinSalary(initialValues.minSalary ? String(initialValues.minSalary) : "");
      setMaxSalary(initialValues.maxSalary ? String(initialValues.maxSalary) : "");
      setSalaryPeriod(initialValues.salaryPeriod || "YEARLY");
      setHasEquity(!!initialValues.hasEquity);
      setEquityRange(initialValues.equityRange || "");
      setHasSignOnBonus(!!initialValues.hasSignOnBonus);
      setSignOnBonus(initialValues.signOnBonus ? String(initialValues.signOnBonus) : "");
      setAnnualBonusPercentage(initialValues.annualBonusPercentage ? String(initialValues.annualBonusPercentage) : "");
      setCompensationNotes(initialValues.compensationNotes || "");
      setTagsInput(initialValues.tags?.join(", ") || "");
      setSelectedBenefits(initialValues.benefits || []);
      setExpirationDays("30");
      setScreeningQuestions(initialValues.screeningQuestions || []);
    }
  }, [initialValues, open]);

  const createMutation = useCreateJobMutation(() => {
    setOpen(false);
    resetForm();
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRequirements("");
    setLocation("");
    setWorkplaceType("REMOTE");
    setJobType("FULL_TIME");
    setExperienceLevel("MID_LEVEL");
    setMinSalary("");
    setMaxSalary("");
    setTagsInput("");
    setSelectedBenefits([]);
    setExpirationDays("30");
    setScreeningQuestions([]);
  };

  const toggleBenefit = (key: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error("Please fill in all required fields (Title, Description, Location)");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const expDays = expirationDays === "none" ? undefined : parseInt(expirationDays, 10);

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.trim() || undefined,
      location: location.trim(),
      workplaceType,
      jobType,
      experienceLevel,
      minSalary: minSalary ? parseInt(minSalary, 10) : undefined,
      maxSalary: maxSalary ? parseInt(maxSalary, 10) : undefined,
      currency: "USD",
      salaryPeriod,
      hasEquity,
      equityRange: hasEquity && equityRange.trim() ? equityRange.trim() : undefined,
      hasSignOnBonus,
      signOnBonus: hasSignOnBonus && signOnBonus ? parseInt(signOnBonus, 10) : undefined,
      annualBonusPercentage: annualBonusPercentage ? parseFloat(annualBonusPercentage) : undefined,
      compensationNotes: compensationNotes.trim() || undefined,
      tags,
      benefits: selectedBenefits,
      expirationDays: expDays,
      status: "PUBLISHED",
      screeningQuestions: screeningQuestions.length > 0 ? screeningQuestions : undefined,
    });
  };

  return (
    <>
      {triggerButton ? (
        <span onClick={() => setOpen(true)} className="inline-block cursor-pointer">
          {triggerButton}
        </span>
      ) : (
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs gap-1.5 rounded-md shadow-sm shadow-primary/20"
        >
          <Plus className="size-3.5" />
          <span>Post New Requisition</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground p-6 sm:p-8 rounded-xl shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <Building2 className="size-3 text-primary" />
            <span>Tenant Requisition Builder</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Create Job Requisition
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Publish an authentic corporate opening directly to verified candidates across the portal.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div className="space-y-1 text-left">
            <Label htmlFor="title" className="text-xs font-medium text-foreground">
              Role Title *
            </Label>
            <Input
              id="title"
              required
              placeholder="e.g. Senior Distributed Systems Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="space-y-1">
              <Label htmlFor="location" className="text-xs font-medium text-foreground">
                Location *
              </Label>
              <Input
                id="location"
                required
                placeholder="e.g. Remote / New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="workplaceType" className="text-xs font-medium text-foreground">
                Workplace Type
              </Label>
              <select
                id="workplaceType"
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="jobType" className="text-xs font-medium text-foreground">
                Employment Type
              </Label>
              <select
                id="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
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
                <Label htmlFor="minSalary" className="text-[11px] font-medium text-foreground">
                  Min Base
                </Label>
                <Input
                  id="minSalary"
                  type="number"
                  placeholder="140000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="maxSalary" className="text-[11px] font-medium text-foreground">
                  Max Base
                </Label>
                <Input
                  id="maxSalary"
                  type="number"
                  placeholder="195000"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="salaryPeriod" className="text-[11px] font-medium text-foreground">
                  Pay Period
                </Label>
                <select
                  id="salaryPeriod"
                  value={salaryPeriod}
                  onChange={(e) => setSalaryPeriod(e.target.value)}
                  className="w-full h-9 bg-background border border-border text-foreground text-xs rounded-md px-2 focus:outline-none focus:border-primary"
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
                    placeholder="Sign-on amount ($)"
                    value={signOnBonus}
                    onChange={(e) => setSignOnBonus(e.target.value)}
                    className="h-8 bg-background border-border text-foreground text-xs rounded-md"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/50">
              <div className="space-y-1">
                <Label htmlFor="annualBonusPercentage" className="text-[11px] font-medium text-foreground">
                  Annual Target Incentive (%)
                </Label>
                <Input
                  id="annualBonusPercentage"
                  type="number"
                  placeholder="e.g. 15 for 15%"
                  value={annualBonusPercentage}
                  onChange={(e) => setAnnualBonusPercentage(e.target.value)}
                  className="h-8 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="compensationNotes" className="text-[11px] font-medium text-foreground">
                  Transparency Disclosure Note
                </Label>
                <Input
                  id="compensationNotes"
                  placeholder="e.g. Disclosed range covers CA & NYC bands"
                  value={compensationNotes}
                  onChange={(e) => setCompensationNotes(e.target.value)}
                  className="h-8 bg-background border-border text-foreground text-xs rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="space-y-1">
              <Label htmlFor="experienceLevel" className="text-xs font-medium text-foreground">
                Experience Level
              </Label>
              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
              >
                <option value="ENTRY_LEVEL">Entry Level (0-2 yrs)</option>
                <option value="MID_LEVEL">Mid Level (3-5 yrs)</option>
                <option value="SENIOR">Senior (5-8 yrs)</option>
                <option value="LEAD">Staff / Lead (8+ yrs)</option>
                <option value="EXECUTIVE">Executive / VP</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="expirationDays" className="text-xs font-medium text-foreground">
                Posting Expiration
              </Label>
              <select
                id="expirationDays"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
              >
                <option value="30">30 Days (Standard)</option>
                <option value="60">60 Days (Extended)</option>
                <option value="90">90 Days (Quarterly)</option>
                <option value="none">No Expiration (Indefinite)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <Label htmlFor="tags" className="text-xs font-medium text-foreground">
              Skills & Tech Tags (comma separated)
            </Label>
            <Input
              id="tags"
              placeholder="Java, Kubernetes, Kafka, Distributed Systems"
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
              Tag top corporate perks included with this requisition.
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

          <div className="space-y-1 text-left">
            <Label htmlFor="description" className="text-xs font-medium text-foreground">
              Job Description *
            </Label>
            <Textarea
              id="description"
              required
              rows={4}
              placeholder="Outline the core responsibilities, team structure, and impact of this role..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1 text-left">
            <Label htmlFor="requirements" className="text-xs font-medium text-foreground">
              Key Requirements & Qualifications
            </Label>
            <Textarea
              id="requirements"
              rows={3}
              placeholder="List required skills, production experience, and qualifications..."
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
              onClick={() => setOpen(false)}
              className="h-9 px-4 text-muted-foreground hover:text-foreground text-xs rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              size="sm"
              className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm shadow-primary/20"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Publishing...
                </>
              ) : (
                "Publish Requisition"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}

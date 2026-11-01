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
import { JobItem } from "../types/job";
import { COMPANY_BENEFITS } from "../types/benefits";
import { Loader2, Edit3, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
  const [tagsInput, setTagsInput] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [expirationDays, setExpirationDays] = useState<string>("30");

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
      setTagsInput(job.tags?.join(", ") || "");
      setSelectedBenefits(job.benefits || []);
      setExpirationDays("30");
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
        currency: job.currency || "USD",
        tags,
        benefits: selectedBenefits,
        expirationDays: isNaN(expDays) ? undefined : expDays,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground p-6 sm:p-8 rounded-xl shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <Edit3 className="size-3 text-primary" />
            <span>Requisition Management</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Edit Job Requisition
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
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
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
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
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
              <Label htmlFor="edit-status" className="text-xs font-medium text-foreground">
                Requisition Status
              </Label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
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
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
              >
                <option value="30">+30 Days from now</option>
                <option value="60">+60 Days from now</option>
                <option value="90">+90 Days from now</option>
                <option value="none">No Expiration (Indefinite)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="space-y-1">
              <Label htmlFor="edit-minSalary" className="text-xs font-medium text-foreground">
                Min Annual Comp (USD)
              </Label>
              <Input
                id="edit-minSalary"
                type="number"
                placeholder="140000"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-maxSalary" className="text-xs font-medium text-foreground">
                Max Annual Comp (USD)
              </Label>
              <Input
                id="edit-maxSalary"
                type="number"
                placeholder="195000"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
              />
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
              Select key benefits included with this role to highlight on public requisition cards.
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
            <Label htmlFor="edit-desc" className="text-xs font-medium text-foreground">
              Job Description *
            </Label>
            <Textarea
              id="edit-desc"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
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

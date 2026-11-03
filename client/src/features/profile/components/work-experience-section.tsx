"use client";

import React, { useState } from "react";
import { WorkExperienceItem } from "../types/profile";
import {
  useAddWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
} from "../hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Plus,
  Trash2,
  MapPin,
  Building2,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface WorkExperienceSectionProps {
  experiences?: WorkExperienceItem[];
}

export function WorkExperienceSection({
  experiences = [],
}: WorkExperienceSectionProps) {
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setCompany("");
    setTitle("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setCurrentlyWorking(false);
    setDescription("");
  };

  const addMutation = useAddWorkExperienceMutation(() => {
    resetForm();
    setIsAdding(false);
  });

  const deleteMutation = useDeleteWorkExperienceMutation();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim()) {
      toast.error("Please enter both Company and Job Title");
      return;
    }

    addMutation.mutate({
      company: company.trim(),
      title: title.trim(),
      location: location.trim() || undefined,
      startDate: startDate.trim() || undefined,
      endDate: currentlyWorking ? "Present" : endDate.trim() || undefined,
      currentlyWorking,
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Briefcase className="size-4 text-primary" />
          <span>Work Experience Timeline</span>
        </h3>
        {!isAdding && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="h-8 text-xs font-mono gap-1.5 border-border cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Experience</span>
          </Button>
        )}
      </div>

      {/* Add Experience Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 rounded-lg border border-primary/30 bg-secondary/30 space-y-3.5 animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Add Work Experience
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                resetForm();
                setIsAdding(false);
              }}
              className="h-7 w-7 p-0 text-muted-foreground"
            >
              <X className="size-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 text-left">
              <Label className="text-xs">Company *</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="h-8 text-xs bg-background"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">Job Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="h-8 text-xs bg-background"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 text-left">
              <Label className="text-xs">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (or Remote)"
                className="h-8 text-xs bg-background"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">Start Date</Label>
              <Input
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. Mar 2021"
                className="h-8 text-xs bg-background font-mono"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">End Date</Label>
              <Input
                value={currentlyWorking ? "Present" : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={currentlyWorking}
                placeholder="e.g. Dec 2023"
                className="h-8 text-xs bg-background font-mono disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
              className="rounded border-border accent-primary size-3.5 cursor-pointer"
            />
            <label
              htmlFor="currentlyWorking"
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              I currently work in this role
            </label>
          </div>

          <div className="space-y-1 text-left">
            <Label className="text-xs">Responsibilities & Achievements</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key projects, technologies used, metrics improved..."
              rows={3}
              className="text-xs bg-background resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                resetForm();
                setIsAdding(false);
              }}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addMutation.isPending || !company.trim() || !title.trim()}
              className="h-8 text-xs font-mono gap-1.5"
            >
              {addMutation.isPending ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Save Experience</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Experience Timeline Feed */}
      {experiences.length === 0 ? (
        <div className="p-6 rounded-lg border border-dashed border-border bg-secondary/10 text-center space-y-1.5">
          <Building2 className="size-6 text-muted-foreground/60 mx-auto" />
          <p className="text-xs text-muted-foreground">
            No work experience entries added yet.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            Showcase your previous employers, seniority, and engineering impact.
          </p>
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="relative flex items-start gap-4 pl-8 group"
            >
              {/* Timeline marker node */}
              <div className="absolute left-2.5 top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />

              <div className="flex-1 p-3.5 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {exp.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
                      <span className="font-semibold text-foreground/90">
                        {exp.company}
                      </span>
                      {exp.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="size-3" />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {exp.startDate || "N/A"} — {exp.currentlyWorking ? "Present" : exp.endDate || "N/A"}
                    </span>
                    {exp.id && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(exp.id!)}
                        disabled={deleteMutation.isPending}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete position"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap pt-1 border-t border-border/40">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

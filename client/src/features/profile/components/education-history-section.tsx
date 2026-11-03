"use client";

import React, { useState } from "react";
import { EducationHistoryItem } from "../types/profile";
import {
  useAddEducationHistoryMutation,
  useDeleteEducationHistoryMutation,
} from "../hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  Plus,
  Trash2,
  School,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface EducationHistorySectionProps {
  educationHistory?: EducationHistoryItem[];
}

export function EducationHistorySection({
  educationHistory = [],
}: EducationHistorySectionProps) {
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gradeOrGpa, setGradeOrGpa] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartDate("");
    setEndDate("");
    setGradeOrGpa("");
    setDescription("");
  };

  const addMutation = useAddEducationHistoryMutation(() => {
    resetForm();
    setIsAdding(false);
  });

  const deleteMutation = useDeleteEducationHistoryMutation();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) {
      toast.error("Please enter both Institution and Degree");
      return;
    }

    addMutation.mutate({
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim() || undefined,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
      gradeOrGpa: gradeOrGpa.trim() || undefined,
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" />
          <span>Education & Credentials</span>
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
            <span>Add Education</span>
          </Button>
        )}
      </div>

      {/* Add Education Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 rounded-lg border border-primary/30 bg-secondary/30 space-y-3.5 animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Add Education History
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
              <Label className="text-xs">University / Institution *</Label>
              <Input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Stanford University"
                className="h-8 text-xs bg-background"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">Degree *</Label>
              <Input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Bachelor of Science"
                className="h-8 text-xs bg-background"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 text-left">
              <Label className="text-xs">Field of Study</Label>
              <Input
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Computer Science"
                className="h-8 text-xs bg-background"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">Start Year</Label>
              <Input
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. 2017"
                className="h-8 text-xs bg-background font-mono"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">Graduation Year</Label>
              <Input
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="e.g. 2021"
                className="h-8 text-xs bg-background font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <Label className="text-xs">Grade / GPA / Honors (Optional)</Label>
            <Input
              value={gradeOrGpa}
              onChange={(e) => setGradeOrGpa(e.target.value)}
              placeholder="e.g. 3.9 GPA / Summa Cum Laude"
              className="h-8 text-xs bg-background max-w-sm"
            />
          </div>

          <div className="space-y-1 text-left">
            <Label className="text-xs">Activities / Societies / Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Relevant coursework, awards, clubs..."
              rows={2}
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
              disabled={addMutation.isPending || !institution.trim() || !degree.trim()}
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
                  <span>Save Education</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Education Timeline Feed */}
      {educationHistory.length === 0 ? (
        <div className="p-6 rounded-lg border border-dashed border-border bg-secondary/10 text-center space-y-1.5">
          <School className="size-6 text-muted-foreground/60 mx-auto" />
          <p className="text-xs text-muted-foreground">
            No education credentials recorded yet.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            Add undergraduate, postgraduate, or bootcamp credentials.
          </p>
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
          {educationHistory.map((edu) => (
            <div
              key={edu.id}
              className="relative flex items-start gap-4 pl-8 group"
            >
              {/* Timeline marker node */}
              <div className="absolute left-2.5 top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />

              <div className="flex-1 p-3.5 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
                      <span className="font-semibold text-foreground/90">
                        {edu.institution}
                      </span>
                      {edu.gradeOrGpa && (
                        <>
                          <span>•</span>
                          <span className="text-primary font-medium">
                            {edu.gradeOrGpa}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {edu.startDate ? `${edu.startDate} — ` : ""}{edu.endDate || "Present"}
                    </span>
                    {edu.id && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(edu.id!)}
                        disabled={deleteMutation.isPending}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete education record"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {edu.description && (
                  <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap pt-1 border-t border-border/40">
                    {edu.description}
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

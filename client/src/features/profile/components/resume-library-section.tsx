"use client";

import React, { useState, useRef } from "react";
import {
  useCandidateResumesQuery,
  useAddCandidateResumeMutation,
  useSetDefaultResumeMutation,
  useDeleteCandidateResumeMutation,
} from "../hooks/use-resumes";
import { applicationsApi } from "@/features/applications/api/applications-api";
import { profileApi } from "../api/profile-api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  Sparkles,
  Star,
  Check,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function ResumeLibrarySection() {
  const queryClient = useQueryClient();
  const { data: resumes = [], isLoading } = useCandidateResumesQuery();
  const addResumeMutation = useAddCandidateResumeMutation();
  const setDefaultMutation = useSetDefaultResumeMutation();
  const deleteMutation = useDeleteCandidateResumeMutation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractingId, setExtractingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes || bytes === 0) return "Cloud Hosted";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = [".pdf", ".docx", ".doc"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(ext)) {
      toast.error("Please upload a PDF or Word document (.pdf, .docx, .doc)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit. Please upload a smaller document.");
      return;
    }

    setSelectedFile(file);
    if (!title) {
      // Auto-suggest title based on filename minus extension
      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }
  };

  const handleSaveResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a resume file to upload");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title/label for this resume version");
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Uploading document to ImageKit cloud...");
      const uploaded = await applicationsApi.uploadResume(selectedFile);

      await addResumeMutation.mutateAsync({
        title: title.trim(),
        fileName: selectedFile.name,
        fileUrl: uploaded.url,
        fileType: selectedFile.type || "application/pdf",
        fileSize: selectedFile.size,
        isDefault,
      });

      // Synchronize candidate profile cache
      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });

      setIsAddOpen(false);
      setTitle("");
      setSelectedFile(null);
      setIsDefault(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload and save resume";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtractFromResume = async (resumeId: string, url: string) => {
    try {
      setExtractingId(resumeId);
      toast.info("Extracting work history, skills & bio from this resume...");
      const parsed = await profileApi.parseResume({ resumeUrl: url });

      if (parsed.workExperiences && parsed.workExperiences.length > 0) {
        for (const exp of parsed.workExperiences) {
          try {
            await profileApi.addWorkExperience(exp);
          } catch {
            // ignore item failure
          }
        }
      }

      if (parsed.educationHistory && parsed.educationHistory.length > 0) {
        for (const edu of parsed.educationHistory) {
          try {
            await profileApi.addEducationHistory(edu);
          } catch {
            // ignore item failure
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
      toast.success(
        `Resume extracted! Added ${parsed.skills?.length || 0} skills, experiences & education.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to extract from resume";
      toast.error(msg);
    } finally {
      setExtractingId(null);
    }
  };

  return (
    <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
            <FolderOpen className="size-4 text-primary" />
            <span>Targeted Resume Library</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {resumes.length} saved
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Store and label tailored CV variants (e.g., &quot;Senior Backend CV&quot;, &quot;Lead Architect&quot;). Choose which version to submit per job application.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 self-start sm:self-auto font-medium"
        >
          <Plus className="size-3.5" />
          <span>Add Resume Version</span>
        </Button>
      </div>

      {/* Resumes List */}
      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-xs font-mono">Loading resume library...</span>
        </div>
      ) : resumes.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-secondary/10 space-y-2">
          <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
            <FileText className="size-5" />
          </div>
          <p className="text-xs font-medium text-foreground">No resumes in your library yet</p>
          <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
            Upload your first resume to enable 1-Click apply, profile auto-extraction, and targeted submissions.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-8 text-xs gap-1.5 mt-2"
          >
            <Plus className="size-3.5" />
            <span>Upload Resume</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {resumes.map((resume) => {
            const isDef = resume.isDefault;
            return (
              <div
                key={resume.id}
                className={`p-4 rounded-lg border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDef
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-secondary/20 hover:bg-secondary/30"
                }`}
              >
                {/* Resume Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`size-10 rounded flex items-center justify-center shrink-0 ${
                      isDef
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground border border-border"
                    }`}
                  >
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foreground truncate">
                        {resume.title}
                      </span>
                      {isDef && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          <CheckCircle2 className="size-2.5" />
                          Default (1-Click Apply)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate flex items-center gap-2">
                      <span className="truncate">{resume.fileName}</span>
                      <span>•</span>
                      <span>{formatFileSize(resume.fileSize)}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(resume.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 flex-wrap">
                  {/* Auto extract profile */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={extractingId === resume.id}
                    onClick={() => handleExtractFromResume(resume.id, resume.fileUrl)}
                    className="h-8 text-xs text-primary hover:bg-primary/10 gap-1 px-2"
                    title="Parse and auto-extract profile skills & work history from this resume"
                  >
                    {extractingId === resume.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Sparkles className="size-3" />
                    )}
                    <span className="hidden md:inline">Extract</span>
                  </Button>

                  {/* Make Default button */}
                  {!isDef ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={setDefaultMutation.isPending}
                      onClick={async () => {
                        await setDefaultMutation.mutateAsync(resume.id);
                        queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
                      }}
                      className="h-8 text-xs border-border hover:border-primary/50 gap-1 px-2.5"
                      title="Set as your primary default resume for 1-Click apply"
                    >
                      <Star className="size-3 text-amber-400" />
                      <span>Make Default</span>
                    </Button>
                  ) : (
                    <span className="text-[11px] font-mono text-muted-foreground px-2 py-1 flex items-center gap-1">
                      <Check className="size-3 text-emerald-500" />
                      <span>Primary</span>
                    </span>
                  )}

                  {/* View link */}
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 h-8 px-2.5 rounded bg-secondary border border-border text-xs text-foreground font-mono hover:bg-secondary/80 transition-colors"
                    title="Open document in new tab"
                  >
                    <ExternalLink className="size-3" />
                    <span>View</span>
                  </a>

                  {/* Delete button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={async () => {
                      if (confirm(`Delete "${resume.title}" from your resume library?`)) {
                        await deleteMutation.mutateAsync(resume.id);
                        queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
                      }
                    }}
                    className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Delete resume"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload New Resume Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border text-foreground p-6 rounded-xl shadow-2xl">
          <DialogHeader className="space-y-1.5 text-left border-b border-border pb-3">
            <DialogTitle className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <UploadCloud className="size-4 text-primary" />
              <span>Add Targeted Resume Version</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Label and store a targeted CV variant for specific roles (e.g., Backend, DevOps, Tech Lead).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveResume} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="resume-title" className="text-xs font-medium text-foreground">
                Resume Label / Target Role *
              </Label>
              <Input
                id="resume-title"
                type="text"
                placeholder="e.g. Senior Backend Engineer CV or DevOps Lead"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 text-xs bg-background border-border"
              />
              <p className="text-[11px] text-muted-foreground">
                Helps you identify which version to select when applying to different jobs.
              </p>
            </div>

            {/* Document Picker */}
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-medium text-foreground">
                Upload File (.PDF, .DOCX) *
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-5 text-center cursor-pointer bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-foreground">
                    <FileText className="size-4 text-primary" />
                    <span className="truncate max-w-[220px]">{selectedFile.name}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <UploadCloud className="size-6 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      Click to choose resume file
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Max file size: 10MB
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Set as Default Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary/20 size-4 bg-background"
              />
              <div className="text-xs">
                <span className="font-medium text-foreground">
                  Set as default for 1-Click Apply
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Pre-selects this resume automatically when submitting job applications.
                </p>
              </div>
            </label>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                disabled={isUploading}
                className="h-9 text-xs border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUploading || !selectedFile || !title.trim()}
                className="h-9 px-4 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium gap-1.5"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    <span>Save to Library</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

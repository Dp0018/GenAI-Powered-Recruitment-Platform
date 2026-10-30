"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { useSubmitApplicationMutation } from "../hooks/use-applications";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useProfileQuery } from "@/features/profile/hooks/use-profile";
import { applicationsApi } from "../api/applications-api";
import {
  Briefcase,
  Send,
  Loader2,
  Phone,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerButton?: React.ReactNode;
}

export function ApplyJobModal({
  jobId,
  jobTitle,
  companyName,
  open,
  onOpenChange,
  triggerButton,
}: ApplyJobModalProps) {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery(open && Boolean(user));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeUrl, setResumeUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    url: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  const [phone, setPhone] = useState(user?.phone || "");
  const [coverLetter, setCoverLetter] = useState("");

  // Auto-fill from candidate profile if available
  useEffect(() => {
    if (open && profile) {
      if (profile.resumeUrl && !resumeUrl) {
        setResumeUrl(profile.resumeUrl);
        setUploadedFile({
          name: profile.resumeFileName || "Primary Resume.pdf",
          size: 0,
          url: profile.resumeUrl,
        });
      }
      if (profile.phone && !phone) {
        setPhone(profile.phone);
      }
    }
  }, [open, profile]);

  const submitMutation = useSubmitApplicationMutation(jobId, () => {
    onOpenChange(false);
    setResumeUrl("");
    setUploadedFile(null);
    setCoverLetter("");
  });

  const handleFileUpload = async (file: File) => {
    const validExtensions = [".pdf", ".docx", ".doc"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a PDF or Word document (.pdf, .docx, .doc)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit. Please upload a smaller document.");
      return;
    }

    try {
      setIsUploading(true);
      const res = await applicationsApi.uploadResume(file);
      setResumeUrl(res.url);
      setUploadedFile({
        name: file.name,
        size: file.size,
        url: res.url,
      });
      toast.success("Resume uploaded successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload resume";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveResume = () => {
    setResumeUrl("");
    setUploadedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Profile Default";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeUrl.trim()) {
      toast.error("Please upload your resume document before submitting");
      return;
    }

    submitMutation.mutate({
      resumeUrl: resumeUrl.trim(),
      phone: phone.trim() || undefined,
      coverLetter: coverLetter.trim() || undefined,
    });
  };

  return (
    <>
      {triggerButton && (
        <span onClick={() => onOpenChange(true)} className="inline-block cursor-pointer">
          {triggerButton}
        </span>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-card border border-border text-foreground p-6 sm:p-8 rounded-xl shadow-2xl">
          <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs text-muted-foreground">
              <Briefcase className="size-3 text-primary" />
              <span className="font-medium">{companyName}</span>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Apply for {jobTitle}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Submit your credentials directly to the hiring team.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Candidate Identity Preview */}
            <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs flex justify-between items-center">
              <div>
                <span className="text-muted-foreground">Applying as: </span>
                <span className="font-semibold text-foreground">{user?.name}</span>
              </div>
              <span className="text-muted-foreground text-[11px] font-mono">{user?.email}</span>
            </div>

            {/* Resume Upload Dropzone */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <FileText className="size-3 text-primary" />
                  <span>Resume / CV Document *</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowUrlFallback(!showUrlFallback)}
                  className="text-[11px] text-primary hover:underline"
                >
                  {showUrlFallback ? "Upload file instead" : "Or paste URL"}
                </button>
              </div>

              {showUrlFallback ? (
                <div className="space-y-1">
                  <Input
                    type="url"
                    placeholder="https://drive.google.com/... or portfolio URL"
                    value={resumeUrl}
                    onChange={(e) => {
                      setResumeUrl(e.target.value);
                      setUploadedFile(null);
                    }}
                    className="h-10 text-xs bg-background border-border"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Link to a publicly accessible Google Drive, Notion, or cloud PDF.
                  </p>
                </div>
              ) : uploadedFile ? (
                /* Uploaded File Pill Card */
                <div className="p-3.5 rounded-lg border border-border bg-secondary/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground truncate flex items-center gap-1.5">
                        <span className="truncate">{uploadedFile.name}</span>
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {formatFileSize(uploadedFile.size)} • Cloud Hosted
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={uploadedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Preview Resume"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Dropzone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-2 space-y-2">
                      <Loader2 className="size-6 animate-spin text-primary" />
                      <span className="text-xs font-medium text-foreground">
                        Uploading to cloud storage...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <div className="size-9 rounded-full bg-secondary border border-border flex items-center justify-center text-primary">
                        <UploadCloud className="size-4" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground">
                          Click to upload
                        </span>{" "}
                        <span className="text-xs text-muted-foreground">or drag and drop</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        PDF or Word documents up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5 text-left">
              <Label htmlFor="phone" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Phone className="size-3 text-primary" />
                <span>Contact Phone</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 text-xs bg-background border-border"
              />
            </div>

            {/* Cover Note */}
            <div className="space-y-1.5 text-left">
              <Label htmlFor="coverLetter" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <FileText className="size-3 text-primary" />
                <span>Note to Hiring Team (Optional)</span>
              </Label>
              <Textarea
                id="coverLetter"
                rows={3}
                placeholder="Briefly highlight relevant experience, key achievements, or availability..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="text-xs bg-background border-border resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 text-xs border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending || isUploading || !resumeUrl.trim()}
                size="sm"
                className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm gap-1.5"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Submit Application</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

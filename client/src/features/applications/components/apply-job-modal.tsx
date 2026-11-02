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
import { useCandidateResumesQuery } from "@/features/profile/hooks/use-resumes";
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
  Save,
  Sparkles,
  FolderOpen,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { JobQuestionItem } from "@/features/jobs/types/job";

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerButton?: React.ReactNode;
  screeningQuestions?: JobQuestionItem[];
  referralCode?: string;
}

export function ApplyJobModal({
  jobId,
  jobTitle,
  companyName,
  open,
  onOpenChange,
  triggerButton,
  screeningQuestions = [],
  referralCode,
}: ApplyJobModalProps) {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery(open && Boolean(user));
  const { data: libraryResumes = [] } = useCandidateResumesQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedResumeId, setSelectedResumeId] = useState<string | "custom">(
    "custom",
  );
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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draftRestoredAt, setDraftRestoredAt] = useState<string | null>(null);

  // Determine active referral code (from prop, URL param, or session storage)
  const [activeReferral, setActiveReferral] = useState<string | undefined>(
    referralCode,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRef = urlParams.get("ref");
      const sessionRef = sessionStorage.getItem("job_portal_referral");
      const chosen = referralCode || urlRef || sessionRef || undefined;
      setActiveReferral(chosen);
    }
  }, [referralCode, open]);

  // Restore draft or auto-fill from resume library / profile when opened
  useEffect(() => {
    if (open) {
      if (typeof window !== "undefined") {
        const draftStr = localStorage.getItem(`job_application_draft_${jobId}`);
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            if (draft.resumeUrl) setResumeUrl(draft.resumeUrl);
            if (draft.uploadedFile) setUploadedFile(draft.uploadedFile);
            if (draft.phone) setPhone(draft.phone);
            if (draft.coverLetter) setCoverLetter(draft.coverLetter);
            if (draft.answers) setAnswers(draft.answers);
            if (draft.savedAt) {
              setDraftRestoredAt(new Date(draft.savedAt).toLocaleTimeString());
            }
            return;
          } catch {
            // ignore corrupted draft
          }
        }
      }

      // If no draft, auto-fill from resume library or candidate profile
      if (!resumeUrl) {
        if (libraryResumes && libraryResumes.length > 0) {
          const defaultResume =
            libraryResumes.find((r) => r.isDefault) || libraryResumes[0];
          setSelectedResumeId(defaultResume.id);
          setResumeUrl(defaultResume.fileUrl);
          setUploadedFile({
            name: defaultResume.fileName,
            size: defaultResume.fileSize || 0,
            url: defaultResume.fileUrl,
          });
        } else if (profile?.resumeUrl) {
          setResumeUrl(profile.resumeUrl);
          setUploadedFile({
            name: profile.resumeFileName || "Primary Resume.pdf",
            size: 0,
            url: profile.resumeUrl,
          });
        }
      }

      if (profile?.phone && !phone) {
        setPhone(profile.phone);
      }
    }
  }, [open, profile, libraryResumes, jobId]);

  const handleSaveDraft = () => {
    if (typeof window === "undefined") return;
    const draft = {
      jobId,
      jobTitle,
      companyName,
      resumeUrl,
      uploadedFile,
      phone,
      coverLetter,
      answers,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      `job_application_draft_${jobId}`,
      JSON.stringify(draft),
    );
    setDraftRestoredAt(new Date().toLocaleTimeString());
    toast.success(
      "Application draft saved! You can safely close and resume later.",
    );
  };

  const handleClearDraft = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`job_application_draft_${jobId}`);
    setDraftRestoredAt(null);
    setCoverLetter("");
    setAnswers({});
    toast.info("Saved draft cleared.");
  };

  const submitMutation = useSubmitApplicationMutation(jobId, () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`job_application_draft_${jobId}`);
    }
    onOpenChange(false);
    setResumeUrl("");
    setUploadedFile(null);
    setCoverLetter("");
    setAnswers({});
    setDraftRestoredAt(null);
  });

  const handleFileUpload = async (file: File) => {
    const validExtensions = [".pdf", ".docx", ".doc"];
    const fileExt = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

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
      const msg =
        err instanceof Error ? err.message : "Failed to upload resume";
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
    setSelectedResumeId("custom");
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

    for (const q of screeningQuestions) {
      const val = answers[q.id || q.questionText]?.trim();
      if (q.required && !val) {
        toast.error(`Please answer required question: "${q.questionText}"`);
        return;
      }
    }

    const formattedAnswers = screeningQuestions
      .filter((q) => answers[q.id || q.questionText]?.trim())
      .map((q) => ({
        questionId: q.id,
        questionText: q.questionText,
        answerText: answers[q.id || q.questionText].trim(),
      }));

    submitMutation.mutate({
      resumeUrl: resumeUrl.trim(),
      phone: phone.trim() || undefined,
      coverLetter: coverLetter.trim() || undefined,
      screeningAnswers:
        formattedAnswers.length > 0 ? formattedAnswers : undefined,
      referralCode: activeReferral?.trim() || undefined,
      referredBy: activeReferral ? `Referral (${activeReferral})` : undefined,
    });
  };

  return (
    <>
      {triggerButton && (
        <span
          onClick={() => onOpenChange(true)}
          className="inline-block cursor-pointer"
        >
          {triggerButton}
        </span>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground p-6 sm:p-8 rounded-xl shadow-2xl">
          <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs text-muted-foreground">
              <Briefcase className="size-3 text-primary" />
              <span className="font-medium">{companyName}</span>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Apply for {jobTitle}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Submit your application to the recruiter.
            </p>
          </DialogHeader>

          {/* Active Referral Tag */}
          {activeReferral && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="size-3.5 text-emerald-400" />
                <span>
                  Referral Tracked: <strong>{activeReferral}</strong>
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded font-semibold">
                Employee Referral
              </span>
            </div>
          )}

          {/* Restored Draft Banner */}
          {draftRestoredAt && (
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs flex items-center justify-between text-foreground">
              <span className="text-muted-foreground">
                Progress restored from draft ({draftRestoredAt})
              </span>
              <button
                type="button"
                onClick={handleClearDraft}
                className="text-[11px] font-mono text-destructive hover:underline ml-2 cursor-pointer"
              >
                Clear Draft
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Candidate Identity Preview */}
            <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs flex justify-between items-center">
              <div>
                <span className="text-muted-foreground">Applying as: </span>
                <span className="font-semibold text-foreground">
                  {user?.name}
                </span>
              </div>
              <span className="text-muted-foreground text-[11px] font-mono">
                {user?.email}
              </span>
            </div>

            {/* Resume Selection / Dropzone */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <FileText className="size-3 text-primary" />
                  <span>Resume (PDF, DOCX) *</span>
                </Label>
                {libraryResumes.length > 0 ? (
                  selectedResumeId === "custom" ? (
                    <button
                      type="button"
                      onClick={() => {
                        const def =
                          libraryResumes.find((r) => r.isDefault) ||
                          libraryResumes[0];
                        setSelectedResumeId(def.id);
                        setResumeUrl(def.fileUrl);
                        setUploadedFile({
                          name: def.fileName,
                          size: def.fileSize || 0,
                          url: def.fileUrl,
                        });
                        setShowUrlFallback(false);
                      }}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      <FolderOpen className="size-3" />
                      <span>Choose from Saved Resumes</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedResumeId("custom");
                        setResumeUrl("");
                        setUploadedFile(null);
                      }}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      <UploadCloud className="size-3" />
                      <span>Upload new resume</span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowUrlFallback(!showUrlFallback)}
                    className="text-[11px] text-primary hover:underline"
                  >
                    {showUrlFallback ? "Upload file instead" : "Or paste URL"}
                  </button>
                )}
              </div>

              {libraryResumes.length > 0 && selectedResumeId !== "custom" ? (
                /* Saved Resume Library Variants */
                <div className="space-y-1.5">
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-0.5">
                    {libraryResumes.map((r) => {
                      const isSelected = selectedResumeId === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => {
                            setSelectedResumeId(r.id);
                            setResumeUrl(r.fileUrl);
                            setUploadedFile({
                              name: r.fileName,
                              size: r.fileSize || 0,
                              url: r.fileUrl,
                            });
                          }}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-sm"
                              : "border-border bg-secondary/20 hover:bg-secondary/40"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`size-8 rounded flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground border border-border"
                              }`}
                            >
                              <FileText className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
                                <span className="truncate">{r.title}</span>
                                {r.isDefault && (
                                  <span className="text-[9px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1 py-0.2 rounded font-semibold">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono truncate">
                                {r.fileName} • {formatFileSize(r.fileSize || 0)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={r.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                              title="Preview Document"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                            <div
                              className={`size-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle2 className="size-3 text-primary-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : showUrlFallback ? (
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
                    Link to a publicly accessible Google Drive, Notion, or cloud
                    PDF.
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
                        <span className="text-xs text-muted-foreground">
                          or drag and drop
                        </span>
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
              <Label
                htmlFor="phone"
                className="text-xs font-medium text-foreground flex items-center gap-1.5"
              >
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

            {/* Pre-Screening Candidate Questions */}
            {screeningQuestions.length > 0 && (
              <div className="space-y-3 p-3.5 rounded-lg border border-border bg-secondary/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <HelpCircle className="size-3.5 text-primary" />
                  <span>Employer Pre-Screening Questions</span>
                </div>

                <div className="space-y-3">
                  {screeningQuestions.map((q, idx) => {
                    const qKey = q.id || q.questionText;
                    const currentVal = answers[qKey] || "";

                    return (
                      <div key={qKey} className="space-y-1.5 text-left">
                        <Label className="text-xs text-foreground font-medium flex items-center justify-between">
                          <span>
                            {idx + 1}. {q.questionText}
                          </span>
                          {q.required ? (
                            <span className="text-[10px] text-destructive font-mono font-normal">
                              * Required
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-mono font-normal">
                              Optional
                            </span>
                          )}
                        </Label>

                        {q.questionType === "BOOLEAN" ? (
                          <div className="flex items-center gap-2">
                            {["Yes", "No"].map((option) => (
                              <button
                                type="button"
                                key={option}
                                onClick={() =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [qKey]: option,
                                  }))
                                }
                                className={`flex-1 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer ${
                                  currentVal === option
                                    ? "bg-primary text-primary-foreground border-primary font-bold"
                                    : "bg-background border-border text-foreground hover:bg-secondary"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : q.questionType === "CHOICE" ? (
                          <select
                            value={currentVal}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [qKey]: e.target.value,
                              }))
                            }
                            className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs text-foreground font-mono focus:border-primary"
                          >
                            <option value="">Select an option...</option>
                            {(q.options || []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            value={currentVal}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [qKey]: e.target.value,
                              }))
                            }
                            placeholder="Type your response..."
                            className="h-8 text-xs bg-background border-border"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cover Note */}
            <div className="space-y-1.5 text-left">
              <Label
                htmlFor="coverLetter"
                className="text-xs font-medium text-foreground flex items-center gap-1.5"
              >
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
            <div className="pt-2 flex items-center justify-between gap-2.5 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={submitMutation.isPending}
                className="h-9 px-3 text-xs border-border text-muted-foreground hover:text-foreground gap-1.5"
                title="Save your progress locally and finish later"
              >
                <Save className="size-3.5 text-primary" />
                <span>Save Draft</span>
              </Button>

              <div className="flex items-center gap-2">
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
                  disabled={
                    submitMutation.isPending || isUploading || !resumeUrl.trim()
                  }
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
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApplicationItem, ApplicationStatus } from "../types/application";
import { useUpdateApplicationStatusMutation } from "../hooks/use-applications";
import {
  FileText,
  ExternalLink,
  Download,
  Mail,
  Briefcase,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Loader2,
  Send,
  MessageSquare,
  Star,
  ListChecks,
  User,
  GraduationCap,
  Globe,
  Code,
  Link2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { RecruiterScreeningScorecard } from "./recruiter-screening-scorecard";
import { useCandidateProfileByIdQuery } from "@/features/profile/hooks/use-profile";
import { useExplainApplicationMatchQuery } from "@/features/ai/hooks/use-ai";
import { ExplainableMatchCard } from "@/features/ai/components/explainable-match-card";

const REJECTION_TEMPLATES = [
  {
    label: "Position Filled",
    note: "Thank you for your application. We have filled this position with another candidate whose background closely matched our immediate needs.",
  },
  {
    label: "Skills Specialization",
    note: "Thank you for your interest. At this stage, our requirements call for deeper specialization in certain core technical competencies outlined in the role.",
  },
  {
    label: "Experience Requirement",
    note: "We appreciate your time. For this particular opening, we are moving forward with candidates who possess more years of senior-level domain experience.",
  },
  {
    label: "Location / Timezone",
    note: "Thank you for applying. Due to core engineering collaboration hours, we are currently prioritizing candidates residing within specific timezones.",
  },
];

interface ResumePreviewModalProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumePreviewModal({
  application,
  open,
  onOpenChange,
}: ResumePreviewModalProps) {
  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const [customNote, setCustomNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);

  const [activeTab, setActiveTab] = useState<
    "overview" | "evaluation" | "answers" | "profile" | "xai"
  >("overview");
  const { data: candidateProfile, isLoading: isProfileLoading } = useCandidateProfileByIdQuery(
    application?.candidate?.id
  );
  const {
    data: xaiData,
    isLoading: isXaiLoading,
    refetch: refetchXai,
  } = useExplainApplicationMatchQuery(
    application?.id,
    Boolean(application?.id && activeTab === "xai")
  );

  if (!application) return null;

  const answersCount = application.screeningAnswers?.length || 0;

  const handleStageTransition = (status: ApplicationStatus) => {
    setSelectedStatus(status);
    updateStatusMutation.mutate(
      {
        applicationId: application.id,
        payload: {
          status,
          notes: customNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setCustomNote("");
          setShowNoteInput(false);
          setSelectedStatus(null);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 bg-card border-border overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-4 px-6 border-b border-border bg-secondary/30 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <span>{application.candidate.name}</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                  {application.status}
                </span>
              </DialogTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="size-3 text-primary" />
                  {application.candidate.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Briefcase className="size-3 text-primary" />
                  {application.job.title}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-6">
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-border text-xs gap-1.5 font-mono"
              >
                <Download className="size-3.5" />
                <span>Open File</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </Button>
            </a>
          </div>
        </DialogHeader>

        {/* Modal Body: Two Columns (PDF Viewer & Cover Letter / Fast Actions) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* PDF Viewer (3 Columns) */}
          <div className="lg:col-span-3 h-full bg-slate-950/60 relative flex flex-col">
            <iframe
              src={`${application.resumeUrl}#toolbar=0`}
              className="w-full h-full border-0"
              title={`${application.candidate.name} Resume`}
            />
          </div>

          {/* Screening Panel & Cover Note (1 Column) */}
          <div className="lg:col-span-1 p-4 flex flex-col justify-between overflow-y-auto bg-card/60 space-y-4">
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex rounded-lg bg-secondary/80 p-0.5 border border-border text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("evaluation")}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === "evaluation"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star className="size-3 text-amber-400" />
                  <span>Scorecard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("answers")}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === "answers"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListChecks className="size-3 text-primary" />
                  <span>Answers</span>
                  {answersCount > 0 && (
                    <span className="ml-0.5 px-1 rounded-full text-[9px] bg-primary/20 text-primary font-bold">
                      {answersCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User className="size-3 text-cyan-400" />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("xai")}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === "xai"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="size-3 text-primary" />
                  <span>AI Fit</span>
                </button>
              </div>

              {/* Prompt Injection / Anomaly Alert if flagged */}
              {((application.resumeAnomalyScore && application.resumeAnomalyScore >= 70) ||
                application.resumeAnomalyFlags) && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <ShieldAlert className="size-4 shrink-0" />
                    <span>AI Trust Alert: Resume Anomaly Flagged</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-200/90 font-sans">
                    Gemini AI detected potential prompt manipulation or hidden prompt injection in this candidate&apos;s resume text.
                  </p>
                </div>
              )}

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-primary" />
                      <span>Candidate Pitch</span>
                    </h4>
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground/90 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                      {application.coverLetter || "No cover note provided by candidate."}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-border/60">
                    <div className="flex justify-between py-1.5 first:pt-0">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-mono text-foreground">{application.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Applied</span>
                      <span className="font-mono text-foreground">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {application.averageRating !== null && application.averageRating !== undefined && (
                      <div className="flex justify-between py-1.5">
                        <span className="text-muted-foreground">Average Score</span>
                        <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                          <Star className="size-3 fill-amber-400" />
                          {application.averageRating.toFixed(1)} / 5.0 ({application.reviewCount || 0})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Internal Evaluation Scorecard */}
              {activeTab === "evaluation" && (
                <RecruiterScreeningScorecard applicationId={application.id} />
              )}

              {/* Tab 3: Pre-Screening Questions & Answers */}
              {activeTab === "answers" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ListChecks className="size-3.5 text-primary" />
                    <span>Candidate Screening Responses</span>
                  </h4>
                  {!application.screeningAnswers || application.screeningAnswers.length === 0 ? (
                    <div className="p-4 rounded-lg border border-dashed border-border bg-secondary/20 text-center text-xs text-muted-foreground">
                      No pre-screening questions configured for this requisition.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {application.screeningAnswers.map((ans, idx) => (
                        <div
                          key={ans.id || idx}
                          className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1.5 text-xs"
                        >
                          <div className="font-medium text-foreground">
                            {idx + 1}. {ans.questionText}
                          </div>
                          <div className="p-2 rounded bg-background border border-border font-mono text-primary text-xs">
                            {ans.answerText || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Candidate Full Profile Inspector */}
              {activeTab === "profile" && (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {isProfileLoading ? (
                    <div className="p-8 text-center space-y-2">
                      <Loader2 className="size-5 animate-spin text-primary mx-auto" />
                      <p className="text-xs text-muted-foreground">Loading candidate profile...</p>
                    </div>
                  ) : !candidateProfile ? (
                    <div className="p-4 rounded-lg border border-dashed border-border bg-secondary/20 text-center text-xs text-muted-foreground">
                      No structured profile record registered.
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs">
                      {/* Bio & Headline */}
                      <div className="p-3 rounded-lg bg-secondary/40 border border-border space-y-1">
                        <div className="font-semibold text-foreground text-sm">
                          {candidateProfile.headline || application.candidate.name}
                        </div>
                        {candidateProfile.bio && (
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {candidateProfile.bio}
                          </p>
                        )}
                        {/* Links */}
                        <div className="flex items-center gap-3 pt-2 flex-wrap text-[11px] font-mono">
                          {candidateProfile.githubUrl && (
                            <a
                              href={candidateProfile.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Code className="size-3" />
                              <span>GitHub</span>
                            </a>
                          )}
                          {candidateProfile.linkedinUrl && (
                            <a
                              href={candidateProfile.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Link2 className="size-3" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {candidateProfile.websiteUrl && (
                            <a
                              href={candidateProfile.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Globe className="size-3" />
                              <span>Portfolio</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Skills Cloud */}
                      {candidateProfile.skills && candidateProfile.skills.length > 0 && (
                        <div>
                          <h5 className="font-mono text-[10px] uppercase font-bold text-muted-foreground mb-1.5">
                            Candidate Skills Cloud
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {candidateProfile.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-full bg-secondary text-foreground text-[10px] font-mono border border-border"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work Experience */}
                      <div>
                        <h5 className="font-mono text-[10px] uppercase font-bold text-muted-foreground mb-1.5 flex items-center gap-1">
                          <Briefcase className="size-3 text-primary" />
                          <span>Work Experience ({candidateProfile.workExperiences?.length || 0})</span>
                        </h5>
                        {(!candidateProfile.workExperiences || candidateProfile.workExperiences.length === 0) ? (
                          <p className="text-muted-foreground text-[11px]">No formal experience entries.</p>
                        ) : (
                          <div className="space-y-2 border-l-2 border-primary/30 pl-2.5 ml-1">
                            {candidateProfile.workExperiences.map((exp) => (
                              <div key={exp.id || exp.title} className="space-y-0.5">
                                <div className="font-semibold text-foreground text-xs">{exp.title}</div>
                                <div className="text-[11px] text-muted-foreground font-mono">
                                  {exp.company} • {exp.startDate || "N/A"} – {exp.currentlyWorking ? "Present" : exp.endDate || "N/A"}
                                </div>
                                {exp.description && (
                                  <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-3">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Education Credentials */}
                      <div>
                        <h5 className="font-mono text-[10px] uppercase font-bold text-muted-foreground mb-1.5 flex items-center gap-1">
                          <GraduationCap className="size-3 text-primary" />
                          <span>Education Credentials ({candidateProfile.educationHistory?.length || 0})</span>
                        </h5>
                        {(!candidateProfile.educationHistory || candidateProfile.educationHistory.length === 0) ? (
                          <p className="text-muted-foreground text-[11px]">No education entries listed.</p>
                        ) : (
                          <div className="space-y-2 border-l-2 border-emerald-500/30 pl-2.5 ml-1">
                            {candidateProfile.educationHistory.map((edu) => (
                              <div key={edu.id || edu.institution} className="space-y-0.5">
                                <div className="font-semibold text-foreground text-xs">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</div>
                                <div className="text-[11px] text-muted-foreground font-mono">
                                  {edu.institution} {edu.endDate ? `(${edu.endDate})` : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Explainable AI Match & Integrity */}
              {activeTab === "xai" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
                      <Sparkles className="size-3.5 text-primary" />
                      <span>Gemini 3.8 Flash XAI Audit</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => refetchXai()}
                      disabled={isXaiLoading}
                      className="h-6 text-[10px] font-mono px-2"
                    >
                      Refresh
                    </Button>
                  </div>

                  {isXaiLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span className="text-xs font-mono">Synthesizing candidate match...</span>
                    </div>
                  ) : xaiData ? (
                    <ExplainableMatchCard data={xaiData} candidateName={application.candidate.name} />
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-foreground font-mono">
                      No XAI report generated yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Action Decision Stage Buttons */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Quick Decision
                </h4>
                <button
                  type="button"
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="text-[11px] font-mono text-primary hover:underline cursor-pointer"
                >
                  {showNoteInput ? "Hide Note" : "+ Add Note to Candidate"}
                </button>
              </div>

              {showNoteInput && (
                <div className="space-y-1.5">
                  <Input
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Feedback note in email..."
                    className="h-8 text-xs bg-secondary/40 border-border"
                  />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    This note will be formatted into the candidate&apos;s Resend notification.
                  </p>
                </div>
              )}

              {/* Structured Rejection Template Selector */}
              <div className="space-y-1">
                <select
                  aria-label="Rejection reason template"
                  defaultValue=""
                  onChange={(e) => {
                    const found = REJECTION_TEMPLATES.find((t) => t.label === e.target.value);
                    if (found) {
                      setCustomNote(found.note);
                      setShowNoteInput(true);
                    }
                  }}
                  className="w-full h-7 rounded border border-border bg-secondary/40 text-[11px] font-mono text-muted-foreground hover:text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="" disabled>Select Polite Rejection Template...</option>
                  {REJECTION_TEMPLATES.map((tpl) => (
                    <option key={tpl.label} value={tpl.label}>
                      {tpl.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("SHORTLISTED")}
                  className="h-8 text-xs border-purple-800/40 text-purple-400 hover:bg-purple-950/30 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "SHORTLISTED" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Sparkles className="size-3" />
                  )}
                  <span>Shortlist</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("INTERVIEWING")}
                  className="h-8 text-xs border-amber-800/40 text-amber-400 hover:bg-amber-950/30 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "INTERVIEWING" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Calendar className="size-3" />
                  )}
                  <span>Interview</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("OFFERED")}
                  className="h-8 text-xs border-emerald-800/40 text-emerald-400 hover:bg-emerald-950/30 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "OFFERED" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3" />
                  )}
                  <span>Offer</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleStageTransition("REJECTED")}
                  className="h-8 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 gap-1"
                >
                  {updateStatusMutation.isPending && selectedStatus === "REJECTED" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <XCircle className="size-3" />
                  )}
                  <span>Reject</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

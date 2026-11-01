"use client";

import React, { useState, useEffect } from "react";
import { ApplicationItem } from "@/features/applications/types/application";
import { useScheduleInterviewMutation } from "../hooks/use-interviews";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Loader2,
  User,
  Briefcase,
  Sparkles,
} from "lucide-react";

interface ScheduleInterviewModalProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleInterviewModal({
  application,
  open,
  onOpenChange,
}: ScheduleInterviewModalProps) {
  const scheduleMutation = useScheduleInterviewMutation();

  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (application && open) {
      setTitle(`Technical Interview: ${application.candidate?.name || "Candidate"} - ${application.job?.title || "Role"}`);
      // Default to tomorrow at 10:00 AM local time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const isoLocal = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setScheduledAt(isoLocal);
      setDurationMinutes(45);
      setMeetingLink("");
      setNotes("");
    }
  }, [application, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !scheduledAt) return;

    // Convert local datetime-local string to UTC ISO string
    const utcIsoString = new Date(scheduledAt).toISOString();

    scheduleMutation.mutate(
      {
        applicationId: application.id,
        title,
        scheduledAt: utcIsoString,
        durationMinutes,
        meetingLink: meetingLink.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border border-border p-6 rounded-xl shadow-xl">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider mb-1">
            <Calendar className="size-3.5" />
            <span>Interview Coordination</span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Schedule Live Interview
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Coordinates a video screening session, sends calendar `.ics` invites, and advances applicant stage to Interviewing.
          </DialogDescription>
        </DialogHeader>

        {/* Candidate Context Pill */}
        <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span className="font-semibold text-foreground">
              {application.candidate?.name || "Candidate"}
            </span>
            <span className="text-muted-foreground font-mono">
              ({application.candidate?.email})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
            <Briefcase className="size-3 text-muted-foreground" />
            <span>{application.job?.title}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Interview Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Interview Title & Session Type
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Technical System Design Screening"
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Date & Time Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>Date & Time (Your Local Timezone)</span>
            </label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Estimated Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 90].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDurationMinutes(dur)}
                  className={`h-8 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer ${
                    durationMinutes === dur
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {dur} mins
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Video Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Video className="size-3.5 text-primary" />
              <span>Video Meeting Link (Google Meet, Zoom, Teams)</span>
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xyz-abcd-efg"
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>

          {/* Recruiter Notes / Prep Guidelines */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" />
              <span>Candidate Preparation Notes / Agenda (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please be ready with a coding environment and your GitHub portfolio."
              className="w-full p-2.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary resize-none leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={scheduleMutation.isPending}
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={scheduleMutation.isPending}
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium gap-1.5"
            >
              {scheduleMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Sending Invitation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  <span>Send Interview Invitation</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

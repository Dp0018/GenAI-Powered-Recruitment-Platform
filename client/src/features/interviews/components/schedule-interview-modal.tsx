"use client";

import React, { useState, useEffect } from "react";
import { ApplicationItem } from "@/features/applications/types/application";
import {
  useScheduleInterviewMutation,
  useProposeSlotsMutation,
} from "../hooks/use-interviews";
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
  Plus,
  Trash2,
  CalendarCheck2,
} from "lucide-react";
import { toast } from "sonner";

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
  const proposeMutation = useProposeSlotsMutation();

  const [bookingMode, setBookingMode] = useState<"DIRECT" | "SELF_BOOKING">("DIRECT");
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [proposedSlots, setProposedSlots] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (application && open) {
      setTitle(
        `Technical Interview: ${application.candidate?.name || "Candidate"} - ${application.job?.title || "Role"}`
      );
      // Default to tomorrow at 10:00 AM local time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const isoLocal1 = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      const tomorrowAfternoon = new Date(tomorrow);
      tomorrowAfternoon.setHours(14, 30, 0, 0);
      const isoLocal2 = new Date(tomorrowAfternoon.getTime() - tomorrowAfternoon.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      dayAfter.setHours(11, 0, 0, 0);
      const isoLocal3 = new Date(dayAfter.getTime() - dayAfter.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setScheduledAt(isoLocal1);
      setProposedSlots([isoLocal1, isoLocal2, isoLocal3]);
      setDurationMinutes(45);
      setMeetingLink("");
      setNotes("");
      setBookingMode("DIRECT");
    }
  }, [application, open]);

  const handleAddSlot = () => {
    if (proposedSlots.length >= 6) {
      toast.info("Maximum 6 proposed time slots allowed");
      return;
    }
    const lastSlot = proposedSlots[proposedSlots.length - 1] || new Date().toISOString().slice(0, 16);
    const nextDate = new Date(lastSlot);
    nextDate.setDate(nextDate.getDate() + 1);
    const isoNext = new Date(nextDate.getTime() - nextDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setProposedSlots([...proposedSlots, isoNext]);
  };

  const handleUpdateSlot = (index: number, val: string) => {
    const updated = [...proposedSlots];
    updated[index] = val;
    setProposedSlots(updated);
  };

  const handleRemoveSlot = (index: number) => {
    if (proposedSlots.length <= 1) {
      toast.error("Please provide at least 1 slot option");
      return;
    }
    setProposedSlots(proposedSlots.filter((_, i) => i !== index));
  };

  const isSubmitting = scheduleMutation.isPending || proposeMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    if (bookingMode === "DIRECT") {
      if (!scheduledAt) {
        toast.error("Please select a date and time for the interview");
        return;
      }
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
    } else {
      // Self-booking mode
      const validSlots = proposedSlots.filter((s) => Boolean(s.trim()));
      if (validSlots.length === 0) {
        toast.error("Please provide at least one available time slot");
        return;
      }
      const utcSlots = validSlots.map((s) => new Date(s).toISOString());
      proposeMutation.mutate(
        {
          applicationId: application.id,
          title,
          proposedSlots: utcSlots,
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
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border p-6 rounded-xl shadow-xl">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider mb-1">
            <Calendar className="size-3.5" />
            <span>Interview Coordination</span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Schedule Interview
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose between direct fixed-time scheduling or sending open slot options for candidate self-booking (Calendly-style).
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

        {/* Scheduling Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/60 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setBookingMode("DIRECT")}
            className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
              bookingMode === "DIRECT"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="size-3.5 text-primary" />
            <span>Direct Schedule</span>
          </button>
          <button
            type="button"
            onClick={() => setBookingMode("SELF_BOOKING")}
            className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
              bookingMode === "SELF_BOOKING"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarCheck2 className="size-3.5 text-emerald-400" />
            <span>Candidate Self-Booking</span>
          </button>
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
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-foreground focus:outline-hidden focus:border-primary"
            />
          </div>

          {bookingMode === "DIRECT" ? (
            /* Single Date & Time Picker */
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
                className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-foreground focus:outline-hidden focus:border-primary font-mono"
              />
            </div>
          ) : (
            /* Calendly-Style Proposed Slots List */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CalendarCheck2 className="size-3.5 text-emerald-400" />
                  <span>Proposed Open Time Slots (Candidate Picks One)</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                >
                  <Plus className="size-3" />
                  <span>Add Slot Option</span>
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Provide multiple open windows that match your availability. The candidate will select their preferred slot without email back-and-forth.
              </p>

              <div className="space-y-2">
                {proposedSlots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-6 text-right">
                      #{idx + 1}
                    </span>
                    <input
                      type="datetime-local"
                      required
                      value={slot}
                      onChange={(e) => handleUpdateSlot(idx, e.target.value)}
                      className="flex-1 h-8 px-2.5 rounded-md bg-background border border-border text-xs text-foreground font-mono focus:outline-hidden focus:border-primary"
                    />
                    {proposedSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(idx)}
                        className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10"
                        title="Remove slot"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              className="w-full h-9 px-3 rounded-md bg-background border border-border text-xs text-foreground focus:outline-hidden focus:border-primary font-mono"
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
              className="w-full p-2.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-hidden focus:border-primary resize-none leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>
                    {bookingMode === "DIRECT" ? "Sending Invitation..." : "Sending Proposed Slots..."}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  <span>
                    {bookingMode === "DIRECT" ? "Schedule Interview" : "Send Slots for Self-Booking"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

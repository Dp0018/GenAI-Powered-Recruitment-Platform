"use client";

import React from "react";
import {
  useCandidateInterviewsQuery,
  useCancelInterviewMutation,
} from "@/features/interviews/hooks/use-interviews";
import { InterviewItem } from "@/features/interviews/types/interview";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Loader2,
  CalendarDays,
  FileDown,
  Building2,
  AlertCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";

export function CandidateInterviewsTab() {
  const { data: interviews, isLoading } = useCandidateInterviewsQuery();
  const cancelMutation = useCancelInterviewMutation();

  const handleCancel = (interview: InterviewItem) => {
    if (confirm(`Are you sure you want to cancel the interview for "${interview.jobTitle}"?`)) {
      cancelMutation.mutate(interview.id);
    }
  };

  const getGoogleCalendarUrl = (interview: InterviewItem) => {
    const start = new Date(interview.scheduledAt);
    const durationMs = (interview.durationMinutes || 45) * 60 * 1000;
    const end = new Date(start.getTime() + durationMs);

    const formatGDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const dates = `${formatGDate(start)}/${formatGDate(end)}`;
    const text = encodeURIComponent(interview.title);
    const details = encodeURIComponent(
      `Job Interview for ${interview.jobTitle} at ${interview.companyName}.\n\nMeeting Link: ${interview.meetingLink || "N/A"}\n\nNotes: ${interview.notes || "None"}`
    );
    const location = encodeURIComponent(interview.meetingLink || interview.companyName);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  const getIcsDownloadUrl = (interviewId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    return `${baseUrl}/interviews/${interviewId}/invite.ics`;
  };

  const items = interviews || [];
  const upcoming = items.filter((i) => i.status === "SCHEDULED" && new Date(i.scheduledAt).getTime() > Date.now());
  const pastOrCancelled = items.filter((i) => i.status !== "SCHEDULED" || new Date(i.scheduledAt).getTime() <= Date.now());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <span>Scheduled Interviews</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Coordinate upcoming video screenings and synchronize schedules with your personal calendar.
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
          {upcoming.length} Active
        </span>
      </div>

      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading scheduled interviews...
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-border bg-card/40 p-12 text-center space-y-3">
          <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
            <CalendarDays className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">No interviews scheduled yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              When an employer reviews and shortlists your application for a position, scheduled video meetings will appear here with calendar invites.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Section */}
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-foreground tracking-wider uppercase font-mono flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                <span>Upcoming Sessions ({upcoming.length})</span>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {upcoming.map((interview) => {
                  const dateObj = new Date(interview.scheduledAt);
                  const isToday = dateObj.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={interview.id}
                      className="p-5 rounded-xl bg-card border border-border/80 shadow-xs hover:border-primary/40 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                              {isToday ? "TODAY" : "UPCOMING"}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {interview.durationMinutes} mins
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-foreground">
                            {interview.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 className="size-3.5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{interview.companyName}</span>
                            <span>•</span>
                            <span>{interview.jobTitle}</span>
                          </div>
                        </div>

                        {/* Date & Time Badge */}
                        <div className="text-left sm:text-right font-mono">
                          <div className="text-sm font-bold text-foreground">
                            {dateObj.toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-primary font-semibold">
                            {dateObj.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Recruiter Notes */}
                      {interview.notes && (
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground space-y-1">
                          <div className="font-semibold text-foreground text-[11px] font-mono uppercase tracking-wider">
                            Preparation Notes & Agenda
                          </div>
                          <p className="leading-relaxed whitespace-pre-line">{interview.notes}</p>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {interview.meetingLink ? (
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-xs"
                            >
                              <Video className="size-3.5" />
                              <span>Join Video Call</span>
                              <ExternalLink className="size-3 ml-0.5 opacity-80" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground font-mono">
                              Link pending from recruiter
                            </span>
                          )}

                          {/* Add to Google Calendar */}
                          <a
                            href={getGoogleCalendarUrl(interview)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground border border-border font-medium text-xs transition-colors"
                          >
                            <Calendar className="size-3.5 text-primary" />
                            <span>Google Calendar</span>
                          </a>

                          {/* Download .ics */}
                          <a
                            href={getIcsDownloadUrl(interview.id)}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground border border-border font-medium text-xs transition-colors"
                            title="Download standard RFC 5545 iCalendar invite for Outlook / Apple Calendar"
                          >
                            <FileDown className="size-3.5 text-muted-foreground" />
                            <span>.ICS File</span>
                          </a>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={cancelMutation.isPending}
                          onClick={() => handleCancel(interview)}
                          className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          Cancel Session
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past / Cancelled Section */}
          {pastOrCancelled.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase font-mono">
                Past & Cancelled Sessions ({pastOrCancelled.length})
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {pastOrCancelled.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-3.5 rounded-lg bg-card/50 border border-border flex items-center justify-between text-xs text-muted-foreground"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-foreground">{interview.title}</div>
                      <div>
                        {interview.companyName} • {interview.jobTitle}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span>{new Date(interview.scheduledAt).toLocaleDateString()}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          interview.status === "CANCELLED"
                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

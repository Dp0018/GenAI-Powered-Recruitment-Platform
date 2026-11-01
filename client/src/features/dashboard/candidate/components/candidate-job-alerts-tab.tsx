"use client";

import React, { useState } from "react";
import {
  useJobAlertsQuery,
  useCreateJobAlertMutation,
  useToggleJobAlertMutation,
  useDeleteJobAlertMutation,
  useTriggerJobAlertDigestMutation,
} from "@/features/jobs/hooks/use-job-alerts";
import { AlertFrequency } from "@/features/jobs/types/job-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Sparkles,
  X,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

export function CandidateJobAlertsTab() {
  const { data: alerts = [], isLoading } = useJobAlertsQuery();
  const createMutation = useCreateJobAlertMutation(() => {
    resetForm();
    setIsAdding(false);
  });
  const toggleMutation = useToggleJobAlertMutation();
  const deleteMutation = useDeleteJobAlertMutation();
  const triggerDigestMutation = useTriggerJobAlertDigestMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [frequency, setFrequency] = useState<AlertFrequency>("DAILY");

  const resetForm = () => {
    setKeyword("");
    setLocation("");
    setFrequency("DAILY");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Please enter a job title or keyword");
      return;
    }

    createMutation.mutate({
      keyword: keyword.trim(),
      location: location.trim() || undefined,
      frequency,
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Card */}
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <span>Job Alerts & Automated Email Digests</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Never miss an opportunity. Get automated email digests delivered straight to your inbox when new positions matching your target criteria are published.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerDigestMutation.mutate()}
            disabled={triggerDigestMutation.isPending || alerts.length === 0}
            className="h-8 text-xs font-mono gap-1.5 border-border cursor-pointer"
            title="Scan for newly published matching jobs and send a test email digest"
          >
            {triggerDigestMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Mail className="size-3.5 text-primary" />
            )}
            <span>Send Test Digest</span>
          </Button>

          {!isAdding && (
            <Button
              size="sm"
              onClick={() => setIsAdding(true)}
              className="h-8 text-xs font-mono gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Create New Alert</span>
            </Button>
          )}
        </div>
      </div>

      {/* Add Alert Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-5 rounded-lg border border-primary/30 bg-card shadow-md space-y-4 animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span>Create Custom Requisition Alert</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 text-left">
              <Label className="text-xs">Job Title / Keyword *</Label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, DevOps, Rust"
                className="h-8 text-xs bg-background"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">Preferred Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, San Francisco, New York"
                className="h-8 text-xs bg-background"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label className="text-xs">Email Digest Frequency</Label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as AlertFrequency)}
                className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs text-foreground font-mono cursor-pointer"
              >
                <option value="DAILY">Daily Morning Digest</option>
                <option value="WEEKLY">Weekly Summary</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-border">
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
              disabled={createMutation.isPending || !keyword.trim()}
              className="h-8 text-xs font-mono gap-1.5"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send className="size-3" />
                  <span>Activate Alert</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Alerts List */}
      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading your job alerts...
          </div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="p-12 rounded-lg border border-dashed border-border bg-card/30 text-center space-y-3">
          <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-primary">
            <Bell className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">No active job alerts configured</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Set up alerts for your target roles to receive automatic email notifications as soon as matching requisitions open up.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-8 text-xs font-mono gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
          >
            <Plus className="size-3.5" />
            <span>Create Your First Alert</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all space-y-3 ${
                alert.active
                  ? "bg-card border-border hover:border-primary/40 shadow-sm"
                  : "bg-secondary/20 border-border/60 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">
                      {alert.keyword}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        alert.active
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      {alert.active ? "Active" : "Paused"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-primary" />
                      {alert.frequency === "DAILY" ? "Daily Digest" : "Weekly Digest"}
                    </span>
                    {alert.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary" />
                          {alert.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMutation.mutate(alert.id)}
                    disabled={toggleMutation.isPending}
                    className="h-7 px-2 text-xs font-mono gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    title={alert.active ? "Pause alert" : "Resume alert"}
                  >
                    {alert.active ? (
                      <>
                        <PauseCircle className="size-3.5 text-amber-400" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="size-3.5 text-emerald-400" />
                        <span>Resume</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(alert.id)}
                    disabled={deleteMutation.isPending}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                    title="Delete alert"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>
                  Created {new Date(alert.createdAt).toLocaleDateString()}
                </span>
                <span>
                  {alert.lastNotifiedAt
                    ? `Last digest sent ${new Date(alert.lastNotifiedAt).toLocaleDateString()}`
                    : "No digest sent yet"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

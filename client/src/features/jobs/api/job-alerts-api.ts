import { apiClient } from "@/lib/api";
import { CreateJobAlertPayload, JobAlertItem } from "../types/job-alert";

export const jobAlertsApi = {
  getMyAlerts: async (): Promise<JobAlertItem[]> => {
    const res = await apiClient<JobAlertItem[]>("/job-alerts");
    return res.data || [];
  },

  createAlert: async (payload: CreateJobAlertPayload): Promise<JobAlertItem> => {
    const res = await apiClient<JobAlertItem>("/job-alerts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to create job alert");
    return res.data;
  },

  toggleAlert: async (alertId: string): Promise<JobAlertItem> => {
    const res = await apiClient<JobAlertItem>(`/job-alerts/${alertId}/toggle`, {
      method: "PATCH",
    });
    if (!res.data) throw new Error("Failed to toggle alert");
    return res.data;
  },

  deleteAlert: async (alertId: string): Promise<void> => {
    await apiClient<void>(`/job-alerts/${alertId}`, {
      method: "DELETE",
    });
  },

  triggerDigestSweep: async (): Promise<{ digestsDispatched: number }> => {
    const res = await apiClient<{ digestsDispatched: number }>("/job-alerts/trigger", {
      method: "POST",
    });
    return res.data || { digestsDispatched: 0 };
  },
};

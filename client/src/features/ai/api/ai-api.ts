import { apiClient } from "@/lib/api";
import { PagedResponse } from "@/types/auth";
import { JobItem } from "@/features/jobs/types/job";
import {
  JobFraudAnalysisResponse,
  ExplainableMatchResponse,
  ResumeAnomalyScanResponse,
} from "../types/ai";

export const aiApi = {
  getJobFraudAnalysis: async (jobId: string): Promise<JobFraudAnalysisResponse> => {
    const res = await apiClient<JobFraudAnalysisResponse>(`/ai/jobs/${jobId}/fraud-analysis`);
    if (!res.data) throw new Error("Failed to retrieve AI Fraud Analysis");
    return res.data;
  },

  explainJobMatch: async (jobId: string): Promise<ExplainableMatchResponse> => {
    const res = await apiClient<ExplainableMatchResponse>(`/ai/jobs/${jobId}/explain-match`);
    if (!res.data) throw new Error("Failed to generate Explainable AI Fit Analysis");
    return res.data;
  },

  explainApplicationMatch: async (applicationId: string): Promise<ExplainableMatchResponse> => {
    const res = await apiClient<ExplainableMatchResponse>(
      `/ai/applications/${applicationId}/explain-match`
    );
    if (!res.data) throw new Error("Failed to generate Explainable AI Application Fit");
    return res.data;
  },

  scanResumeText: async (resumeText: string): Promise<ResumeAnomalyScanResponse> => {
    const res = await apiClient<ResumeAnomalyScanResponse>("/ai/resumes/scan", {
      method: "POST",
      body: JSON.stringify({ resumeText }),
    });
    if (!res.data) throw new Error("Resume anomaly scan failed");
    return res.data;
  },

  getQuarantinedJobs: async (
    page = 0,
    size = 10
  ): Promise<PagedResponse<JobItem>> => {
    const res = await apiClient<PagedResponse<JobItem>>(
      `/admin/fraud/quarantine?page=${page}&size=${size}`
    );
    return (
      res.data || {
        content: [],
        pageNumber: 0,
        pageSize: size,
        totalElements: 0,
        totalPages: 0,
        last: true,
      }
    );
  },

  approveQuarantinedJob: async (jobId: string): Promise<JobItem> => {
    const res = await apiClient<JobItem>(`/admin/fraud/jobs/${jobId}/approve`, {
      method: "PUT",
    });
    if (!res.data) throw new Error("Failed to approve quarantined job");
    return res.data;
  },

  rejectQuarantinedJob: async (jobId: string): Promise<JobItem> => {
    const res = await apiClient<JobItem>(`/admin/fraud/jobs/${jobId}/reject`, {
      method: "PUT",
    });
    if (!res.data) throw new Error("Failed to reject quarantined job");
    return res.data;
  },

  generateJobDescription: async (title: string, notes?: string): Promise<{ description: string }> => {
    const res = await apiClient<{ description: string }>("/ai/jobs/generate-description", {
      method: "POST",
      body: JSON.stringify({ title, notes }),
    });
    if (!res.data) throw new Error("Failed to generate job description");
    return res.data;
  },
};

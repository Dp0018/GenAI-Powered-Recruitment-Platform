import { apiClient } from "@/lib/api";
import { PagedResponse } from "@/types/auth";
import { JobItem, CreateJobPayload, SearchJobsParams } from "../types/job";

export const jobsApi = {
  searchJobs: async (params: SearchJobsParams = {}): Promise<PagedResponse<JobItem>> => {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set("query", params.query);
    if (params.location && params.location !== "all") searchParams.set("location", params.location);
    if (params.workplaceType && params.workplaceType !== "ALL")
      searchParams.set("workplaceType", params.workplaceType);
    if (params.jobType && params.jobType !== "ALL") searchParams.set("jobType", params.jobType);
    if (params.experienceLevel && params.experienceLevel !== "ALL")
      searchParams.set("experienceLevel", params.experienceLevel);
    if (params.minSalary && params.minSalary > 0)
      searchParams.set("minSalary", params.minSalary.toString());
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.page !== undefined) searchParams.set("page", params.page.toString());
    if (params.size !== undefined) searchParams.set("size", params.size.toString());

    const queryString = searchParams.toString();
    const endpoint = `/jobs${queryString ? `?${queryString}` : ""}`;

    const res = await apiClient<PagedResponse<JobItem>>(endpoint);
    return (
      res.data || {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
      }
    );
  },

  getJobBySlug: async (slug: string): Promise<JobItem> => {
    const res = await apiClient<JobItem>(`/jobs/${slug}`);
    if (!res.data) throw new Error("Job requisition not found");
    return res.data;
  },

  getMyCompanyJobs: async (page = 0, size = 10): Promise<PagedResponse<JobItem>> => {
    const res = await apiClient<PagedResponse<JobItem>>(`/jobs/my-company?page=${page}&size=${size}`);
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

  createJob: async (payload: CreateJobPayload): Promise<JobItem> => {
    const res = await apiClient<JobItem>("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Job creation response was empty");
    return res.data;
  },

  updateJob: async (id: string, payload: CreateJobPayload): Promise<JobItem> => {
    const res = await apiClient<JobItem>(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Job update response was empty");
    return res.data;
  },

  updateJobStatus: async (id: string, status: "PUBLISHED" | "CLOSED" | "DRAFT"): Promise<JobItem> => {
    const res = await apiClient<JobItem>(`/jobs/${id}/status?status=${status}`, {
      method: "PATCH",
    });
    if (!res.data) throw new Error("Job status update response was empty");
    return res.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await apiClient(`/jobs/${id}`, {
      method: "DELETE",
    });
  },

  toggleSaveJob: async (jobId: string): Promise<boolean> => {
    const res = await apiClient<boolean>(`/jobs/${jobId}/save`, {
      method: "POST",
    });
    return Boolean(res.data);
  },

  isJobSaved: async (jobId: string): Promise<boolean> => {
    const res = await apiClient<boolean>(`/jobs/${jobId}/is-saved`);
    return Boolean(res.data);
  },

  getSavedJobs: async (page = 0, size = 10): Promise<PagedResponse<JobItem>> => {
    const res = await apiClient<PagedResponse<JobItem>>(`/jobs/saved?page=${page}&size=${size}`);
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
};

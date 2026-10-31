package com.example.job_portal.service;

import com.example.job_portal.common.response.PagedResponse;
import com.example.job_portal.dto.job.JobResponse;
import com.example.job_portal.security.UserPrincipal;
import org.springframework.data.domain.Pageable;

public interface SavedJobService {

    boolean toggleSaveJob(String jobId, UserPrincipal currentUser);

    boolean isJobSaved(String jobId, UserPrincipal currentUser);

    PagedResponse<JobResponse> getSavedJobs(UserPrincipal currentUser, Pageable pageable);

    void removeSavedJob(String jobId, UserPrincipal currentUser);
}

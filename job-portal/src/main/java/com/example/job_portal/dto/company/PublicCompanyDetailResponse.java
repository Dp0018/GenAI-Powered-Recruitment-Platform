package com.example.job_portal.dto.company;

import com.example.job_portal.dto.job.JobResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicCompanyDetailResponse {
    private CompanyResponse company;
    private List<JobResponse> openJobs;
}

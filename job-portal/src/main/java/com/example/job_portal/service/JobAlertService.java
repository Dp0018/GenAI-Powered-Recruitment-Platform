package com.example.job_portal.service;

import com.example.job_portal.dto.alert.CreateJobAlertRequest;
import com.example.job_portal.dto.alert.JobAlertResponse;
import com.example.job_portal.security.UserPrincipal;

import java.util.List;

public interface JobAlertService {

    JobAlertResponse createAlert(UserPrincipal currentUser, CreateJobAlertRequest request);

    List<JobAlertResponse> getMyAlerts(UserPrincipal currentUser);

    JobAlertResponse toggleAlert(UserPrincipal currentUser, String alertId);

    void deleteAlert(UserPrincipal currentUser, String alertId);

    int triggerDigestExecution();
}

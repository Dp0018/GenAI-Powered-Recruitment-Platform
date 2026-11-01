package com.example.job_portal.scheduler;

import com.example.job_portal.service.JobAlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JobAlertScheduler {

    private final JobAlertService jobAlertService;

    /**
     * Runs daily at 08:00 AM UTC to dispatch automated job alert digests to subscribed candidates.
     */
    @Scheduled(cron = "${app.job-alerts.cron:0 0 8 * * *}")
    public void runJobAlertDigests() {
        log.info("Starting scheduled job alert digest execution worker...");
        int count = jobAlertService.triggerDigestExecution();
        log.info("Completed scheduled job alert digest run: {} digests dispatched", count);
    }
}

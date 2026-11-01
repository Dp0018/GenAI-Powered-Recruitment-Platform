package com.example.job_portal.service;

import com.example.job_portal.entity.Interview;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Service
public class IcsCalendarService {

    private static final DateTimeFormatter ICS_DATE_FORMAT = DateTimeFormatter
            .ofPattern("yyyyMMdd'T'HHmmss'Z'")
            .withZone(ZoneOffset.UTC);

    public String generateIcsCalendar(Interview interview) {
        Instant start = interview.getScheduledAt();
        int duration = interview.getDurationMinutes() != null ? interview.getDurationMinutes() : 45;
        Instant end = start.plusSeconds(duration * 60L);
        Instant now = Instant.now();

        String companyName = interview.getApplication().getJob().getCompany().getName();
        String candidateName = interview.getCandidate().getName();
        String candidateEmail = interview.getCandidate().getEmail();
        String meetingLink = interview.getMeetingLink() != null ? interview.getMeetingLink() : "Online Video Call";
        String notes = interview.getNotes() != null ? interview.getNotes().replace("\n", "\\n") : "Live Interview Session";

        StringBuilder sb = new StringBuilder();
        sb.append("BEGIN:VCALENDAR\r\n");
        sb.append("VERSION:2.0\r\n");
        sb.append("PRODID:-//JobPortal Platform//Interview Scheduler//EN\r\n");
        sb.append("CALSCALE:GREGORIAN\r\n");
        sb.append("METHOD:REQUEST\r\n");
        sb.append("BEGIN:VEVENT\r\n");
        sb.append("UID:").append(interview.getId()).append("@jobportal.internal\r\n");
        sb.append("DTSTAMP:").append(ICS_DATE_FORMAT.format(now)).append("\r\n");
        sb.append("DTSTART:").append(ICS_DATE_FORMAT.format(start)).append("\r\n");
        sb.append("DTEND:").append(ICS_DATE_FORMAT.format(end)).append("\r\n");
        sb.append("SUMMARY:").append(interview.getTitle()).append("\r\n");
        sb.append("DESCRIPTION:").append(notes).append("\\nMeeting Link: ").append(meetingLink).append("\r\n");
        sb.append("LOCATION:").append(meetingLink).append("\r\n");
        sb.append("STATUS:CONFIRMED\r\n");
        sb.append("ORGANIZER;CN=\"").append(companyName).append("\":mailto:no-reply@jobportal.internal\r\n");
        sb.append("ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=\"")
                .append(candidateName).append("\":mailto:").append(candidateEmail).append("\r\n");
        sb.append("END:VEVENT\r\n");
        sb.append("END:VCALENDAR\r\n");

        return sb.toString();
    }
}

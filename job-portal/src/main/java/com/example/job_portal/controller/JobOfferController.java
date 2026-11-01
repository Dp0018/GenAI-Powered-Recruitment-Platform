package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.offer.CreateJobOfferRequest;
import com.example.job_portal.dto.offer.DeclineOfferRequest;
import com.example.job_portal.dto.offer.JobOfferResponse;
import com.example.job_portal.dto.offer.SignOfferRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.job_portal.security.UserPrincipal;
import com.example.job_portal.service.JobOfferService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'EMPLOYER_ADMIN')")
    public ResponseEntity<ApiResponse<JobOfferResponse>> createOffer(
            @Valid @RequestBody CreateJobOfferRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        JobOfferResponse response = jobOfferService.createOffer(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Offer draft created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'EMPLOYER_ADMIN')")
    public ResponseEntity<ApiResponse<JobOfferResponse>> updateOffer(
            @PathVariable String id,
            @Valid @RequestBody CreateJobOfferRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        JobOfferResponse response = jobOfferService.updateOffer(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Offer updated successfully", response));
    }

    @PostMapping("/{id}/send")
    @PreAuthorize("hasAnyRole('RECRUITER', 'EMPLOYER_ADMIN')")
    public ResponseEntity<ApiResponse<JobOfferResponse>> sendOffer(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        JobOfferResponse response = jobOfferService.sendOffer(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Offer sent to candidate successfully", response));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<JobOfferResponse>> getOfferByApplicationId(
            @PathVariable String applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        JobOfferResponse response = jobOfferService.getOfferByApplicationId(applicationId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobOfferResponse>> getOfferById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        JobOfferResponse response = jobOfferService.getOfferById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/employer")
    @PreAuthorize("hasAnyRole('RECRUITER', 'EMPLOYER_ADMIN')")
    public ResponseEntity<ApiResponse<List<JobOfferResponse>>> getCompanyOffers(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<JobOfferResponse> response = jobOfferService.getCompanyOffers(currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<List<JobOfferResponse>>> getCandidateOffers(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<JobOfferResponse> response = jobOfferService.getCandidateOffers(currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/sign/{token}")
    public ResponseEntity<ApiResponse<JobOfferResponse>> getOfferBySignatureToken(
            @PathVariable String token
    ) {
        JobOfferResponse response = jobOfferService.getOfferBySignatureToken(token);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/sign/{token}/accept")
    public ResponseEntity<ApiResponse<JobOfferResponse>> signOffer(
            @PathVariable String token,
            @Valid @RequestBody SignOfferRequest request,
            HttpServletRequest servletRequest
    ) {
        String clientIp = servletRequest.getRemoteAddr();
        JobOfferResponse response = jobOfferService.signOffer(token, request, clientIp);
        return ResponseEntity.ok(ApiResponse.success("Offer successfully signed and accepted! Welcome aboard.", response));
    }

    @PostMapping("/sign/{token}/decline")
    public ResponseEntity<ApiResponse<JobOfferResponse>> declineOffer(
            @PathVariable String token,
            @RequestBody(required = false) DeclineOfferRequest request
    ) {
        JobOfferResponse response = jobOfferService.declineOffer(token, request);
        return ResponseEntity.ok(ApiResponse.success("Offer declined", response));
    }

    @GetMapping("/{id}/letter.html")
    public ResponseEntity<String> downloadOfferLetterHtml(@PathVariable String id) {
        String html = jobOfferService.generateOfferLetterHtml(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"offer-letter.html\"")
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}

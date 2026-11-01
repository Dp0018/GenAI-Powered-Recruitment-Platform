package com.example.job_portal.service;

import com.example.job_portal.dto.offer.CreateJobOfferRequest;
import com.example.job_portal.dto.offer.DeclineOfferRequest;
import com.example.job_portal.dto.offer.JobOfferResponse;
import com.example.job_portal.dto.offer.SignOfferRequest;
import com.example.job_portal.security.UserPrincipal;

import java.util.List;

public interface JobOfferService {

    JobOfferResponse createOffer(CreateJobOfferRequest request, UserPrincipal recruiter);

    JobOfferResponse updateOffer(String offerId, CreateJobOfferRequest request, UserPrincipal recruiter);

    JobOfferResponse sendOffer(String offerId, UserPrincipal recruiter);

    JobOfferResponse getOfferByApplicationId(String applicationId, UserPrincipal user);

    JobOfferResponse getOfferById(String offerId, UserPrincipal user);

    JobOfferResponse getOfferBySignatureToken(String signatureToken);

    JobOfferResponse signOffer(String signatureToken, SignOfferRequest request, String clientIp);

    JobOfferResponse declineOffer(String signatureToken, DeclineOfferRequest request);

    List<JobOfferResponse> getCompanyOffers(UserPrincipal recruiter);

    List<JobOfferResponse> getCandidateOffers(UserPrincipal candidate);

    String generateOfferLetterHtml(String offerId);
}

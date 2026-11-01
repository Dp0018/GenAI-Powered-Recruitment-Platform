package com.example.job_portal.dto.offer;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignOfferRequest {

    @NotBlank(message = "Signer full legal name is required")
    private String signerName;

    @AssertTrue(message = "You must consent to electronic signature and terms of employment")
    private Boolean signatureConsent;
}

package com.example.job_portal.dto.billing;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponse {
    private String checkoutUrl;
    private String sessionId;
}

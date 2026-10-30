package com.example.job_portal.common.exception;

public class VendorNotVerifiedException extends RuntimeException {
    public VendorNotVerifiedException(String message) {
        super(message);
    }

    public VendorNotVerifiedException(Long companyId) {
        super(String.format("Vendor / Company [ID: %d] has not been verified by platform administrators yet.", companyId));
    }
}

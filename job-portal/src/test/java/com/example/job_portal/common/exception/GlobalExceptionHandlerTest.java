package com.example.job_portal.common.exception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.*;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    // Test controller to trigger exception conditions
    @RestController
    @RequestMapping("/test/errors")
    static class TestErrorController {

        @GetMapping("/not-found")
        public void triggerNotFound() {
            throw new ResourceNotFoundException("Job", "id", 999L);
        }

        @GetMapping("/bad-request")
        public void triggerBadRequest() {
            throw new BadRequestException("Invalid query parameter supplied");
        }

        @GetMapping("/duplicate")
        public void triggerDuplicate() {
            throw new DuplicateResourceException("Company", "slug", "tech-corp");
        }

        @GetMapping("/vendor-unverified")
        public void triggerVendorUnverified() {
            throw new VendorNotVerifiedException(42L);
        }

        @PostMapping("/validate")
        public void triggerValidation(@Valid @RequestBody DummyPayload payload) {
            // No-op
        }
    }

    record DummyPayload(@NotBlank(message = "Title is required") String title) {}

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new TestErrorController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("Should return 404 with structured error payload for ResourceNotFoundException")
    void shouldHandleResourceNotFound() throws Exception {
        mockMvc.perform(get("/test/errors/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.statusCode", is(404)))
                .andExpect(jsonPath("$.errorCode", is("RESOURCE_NOT_FOUND")))
                .andExpect(jsonPath("$.message", containsString("Job not found with id: '999'")))
                .andExpect(jsonPath("$.path", is("/test/errors/not-found")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    @DisplayName("Should return 409 with structured error payload for DuplicateResourceException")
    void shouldHandleDuplicateResource() throws Exception {
        mockMvc.perform(get("/test/errors/duplicate"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.statusCode", is(409)))
                .andExpect(jsonPath("$.errorCode", is("DUPLICATE_RESOURCE")))
                .andExpect(jsonPath("$.message", containsString("Company already exists with slug: 'tech-corp'")));
    }

    @Test
    @DisplayName("Should return 403 for VendorNotVerifiedException")
    void shouldHandleVendorNotVerified() throws Exception {
        mockMvc.perform(get("/test/errors/vendor-unverified"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.statusCode", is(403)))
                .andExpect(jsonPath("$.errorCode", is("VENDOR_NOT_VERIFIED")))
                .andExpect(jsonPath("$.message", containsString("Vendor / Company [ID: 42] has not been verified")));
    }

    @Test
    @DisplayName("Should return 400 with field-level errors on DTO validation failure")
    void shouldHandleValidationErrors() throws Exception {
        mockMvc.perform(post("/test/errors/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.errorCode", is("VALIDATION_FAILED")))
                .andExpect(jsonPath("$.errors", hasSize(1)))
                .andExpect(jsonPath("$.errors[0].field", is("title")))
                .andExpect(jsonPath("$.errors[0].message", is("Title is required")));
    }
}

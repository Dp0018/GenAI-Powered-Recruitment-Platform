package com.example.job_portal.controller;

import com.example.job_portal.common.response.ApiResponse;
import com.example.job_portal.dto.file.FileUploadResponse;
import com.example.job_portal.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadResume(
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Received resume upload request: name={}, size={}", file.getOriginalFilename(), file.getSize());
        FileUploadResponse response = fileStorageService.uploadResume(file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", response));
    }

    @PostMapping(value = "/upload/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadAvatar(
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Received avatar upload request: name={}, size={}", file.getOriginalFilename(), file.getSize());
        FileUploadResponse response = fileStorageService.uploadAvatar(file);
        return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", response));
    }
}

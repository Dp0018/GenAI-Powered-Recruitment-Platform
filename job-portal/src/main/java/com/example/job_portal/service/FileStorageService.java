package com.example.job_portal.service;

import com.example.job_portal.dto.file.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    FileUploadResponse uploadResume(MultipartFile file);
    FileUploadResponse uploadAvatar(MultipartFile file);
}

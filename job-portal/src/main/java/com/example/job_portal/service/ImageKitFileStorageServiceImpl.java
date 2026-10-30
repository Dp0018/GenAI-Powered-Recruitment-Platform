package com.example.job_portal.service;

import com.example.job_portal.common.exception.BadRequestException;
import com.example.job_portal.common.exception.InvalidOperationException;
import com.example.job_portal.dto.file.FileUploadResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ImageKitFileStorageServiceImpl implements FileStorageService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${app.imagekit.url-endpoint:https://ik.imagekit.io/ic07orwae}")
    private String urlEndpoint;

    @Value("${app.imagekit.private-key:}")
    private String privateKey;

    @Value("${app.imagekit.public-key:}")
    private String publicKey;

    private static final List<String> ALLOWED_RESUME_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private static final long MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    private static final long MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;  // 5 MB

    public ImageKitFileStorageServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl("https://upload.imagekit.io/api/v1")
                .build();
    }

    @Override
    public FileUploadResponse uploadResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload.");
        }

        if (file.getSize() > MAX_RESUME_SIZE_BYTES) {
            throw new BadRequestException("File size exceeds 10MB limit. Please upload a smaller file.");
        }

        String contentType = file.getContentType();
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");

        boolean isPdfOrDoc = (contentType != null && ALLOWED_RESUME_TYPES.contains(contentType.toLowerCase()))
                || originalFilename.toLowerCase().endsWith(".pdf")
                || originalFilename.toLowerCase().endsWith(".docx")
                || originalFilename.toLowerCase().endsWith(".doc");

        if (!isPdfOrDoc) {
            throw new BadRequestException("Invalid file format. Only PDF and Word documents (.pdf, .docx, .doc) are permitted.");
        }

        return executeUpload(file, originalFilename, "/resumes");
    }

    @Override
    public FileUploadResponse uploadAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select an image file to upload.");
        }

        if (file.getSize() > MAX_AVATAR_SIZE_BYTES) {
            throw new BadRequestException("Image size exceeds 5MB limit. Please select a smaller image.");
        }

        String contentType = file.getContentType();
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar.jpg");

        boolean isImage = (contentType != null && ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase()))
                || originalFilename.toLowerCase().endsWith(".jpg")
                || originalFilename.toLowerCase().endsWith(".jpeg")
                || originalFilename.toLowerCase().endsWith(".png")
                || originalFilename.toLowerCase().endsWith(".webp");

        if (!isImage) {
            throw new BadRequestException("Invalid image format. Allowed formats: JPG, PNG, WEBP.");
        }

        return executeUpload(file, originalFilename, "/avatars");
    }

    private FileUploadResponse executeUpload(MultipartFile file, String originalFilename, String folder) {
        if (!StringUtils.hasText(privateKey)) {
            log.error("ImageKit private key is not configured.");
            throw new InvalidOperationException("File storage service is not configured. Please contact support.");
        }

        try {
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }
            String baseName = dotIndex > 0 ? originalFilename.substring(0, dotIndex) : originalFilename;
            String sanitizedBase = baseName.replaceAll("[^a-zA-Z0-9_-]", "_");
            String uploadFileName = sanitizedBase + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return uploadFileName;
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);
            body.add("fileName", uploadFileName);
            body.add("folder", folder);
            body.add("useUniqueFileName", "true");

            String rawResponse = restClient.post()
                    .uri("/files/upload")
                    .headers(headers -> headers.setBasicAuth(privateKey.trim(), ""))
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode responseJson = objectMapper.readTree(rawResponse);

            String fileId = responseJson.path("fileId").asText();
            String name = responseJson.path("name").asText(originalFilename);
            String url = responseJson.path("url").asText();
            String thumbnailUrl = responseJson.path("thumbnailUrl").asText(null);
            long size = responseJson.path("size").asLong(file.getSize());
            String fileType = responseJson.path("fileType").asText("document");

            log.info("Successfully uploaded file to ImageKit folder {}. FileId: {}, URL: {}", folder, fileId, url);

            return FileUploadResponse.builder()
                    .fileId(fileId)
                    .name(name)
                    .url(url)
                    .thumbnailUrl(thumbnailUrl)
                    .size(size)
                    .fileType(fileType)
                    .build();

        } catch (IOException e) {
            log.error("Failed to read uploaded file bytes", e);
            throw new InvalidOperationException("Failed to process uploaded file: " + e.getMessage());
        } catch (Exception e) {
            log.error("ImageKit upload request failed", e);
            throw new InvalidOperationException("Failed to upload file to cloud storage: " + e.getMessage());
        }
    }
}

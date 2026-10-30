package com.example.job_portal.dto.file;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String fileId;
    private String name;
    private String url;
    private String thumbnailUrl;
    private Long size;
    private String fileType;
}

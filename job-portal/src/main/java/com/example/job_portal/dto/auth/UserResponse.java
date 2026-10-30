package com.example.job_portal.dto.auth;

import com.example.job_portal.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private boolean emailVerified;
    private String image;
    private Role role;
    private String phone;
    private boolean banned;
    private CompanyResponse company;
    private Instant createdAt;
}

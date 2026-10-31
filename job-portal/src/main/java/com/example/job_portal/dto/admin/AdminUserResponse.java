package com.example.job_portal.dto.admin;

import com.example.job_portal.entity.Role;
import com.example.job_portal.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private String id;
    private String name;
    private String email;
    private Role role;
    private boolean emailVerified;
    private boolean banned;
    private String banReason;
    private Instant banExpires;
    private String phone;
    private String companyId;
    private String companyName;
    private Instant createdAt;

    public static AdminUserResponse fromEntity(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .banned(user.isBanned())
                .banReason(user.getBanReason())
                .banExpires(user.getBanExpires())
                .phone(user.getPhone())
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}

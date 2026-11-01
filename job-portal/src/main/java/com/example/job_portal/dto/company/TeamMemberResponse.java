package com.example.job_portal.dto.company;

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
public class TeamMemberResponse {
    private String id;
    private String name;
    private String email;
    private String image;
    private Role role;
    private Instant joinedAt;

    public static TeamMemberResponse fromEntity(User user) {
        return TeamMemberResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .image(user.getImage())
                .role(user.getRole())
                .joinedAt(user.getCreatedAt())
                .build();
    }
}

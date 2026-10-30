package com.example.job_portal.mapper;

import com.example.job_portal.dto.auth.CompanyResponse;
import com.example.job_portal.dto.auth.UserResponse;
import com.example.job_portal.entity.Company;
import com.example.job_portal.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .image(user.getImage())
                .role(user.getRole())
                .phone(user.getPhone())
                .banned(user.isBanned())
                .company(toCompanyResponse(user.getCompany()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    public CompanyResponse toCompanyResponse(Company company) {
        if (company == null) {
            return null;
        }

        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .slug(company.getSlug())
                .logoUrl(company.getLogoUrl())
                .website(company.getWebsite())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .location(company.getLocation())
                .verificationStatus(company.getVerificationStatus())
                .build();
    }
}

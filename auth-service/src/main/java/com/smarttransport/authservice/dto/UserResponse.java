package com.smarttransport.authservice.dto;

import java.time.Instant;

public class UserResponse {
    private Long id;
    private String username;
    private String role;
    private String fullName;
    private String city;
    private Instant createdAt;

    public UserResponse(Long id, String username, String role, String fullName, String city, Instant createdAt) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
        this.city = city;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getCity() {
        return city;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

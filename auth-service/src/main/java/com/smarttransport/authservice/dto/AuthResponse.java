package com.smarttransport.authservice.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private String fullName;
    private String city;

    public AuthResponse(String token, String username, String role, String fullName, String city) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
        this.city = city;
    }

    public String getToken() {
        return token;
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
}

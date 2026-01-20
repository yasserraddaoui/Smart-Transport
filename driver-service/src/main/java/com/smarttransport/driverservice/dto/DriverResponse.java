package com.smarttransport.driverservice.dto;

import com.smarttransport.driverservice.domain.DriverStatus;

import java.time.Instant;

public class DriverResponse {

    private Long id;
    private String fullName;
    private String phone;
    private String licenseNumber;
    private DriverStatus status;
    private Instant createdAt;

    public DriverResponse() {
    }

    public DriverResponse(Long id, String fullName, String phone, String licenseNumber, DriverStatus status, Instant createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public DriverStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}


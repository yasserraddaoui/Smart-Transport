package com.smarttransport.gpsservice.dto;

import java.time.Instant;

public class GpsLocationResponse {
    private Long id;
    private Long busId;
    private double latitude;
    private double longitude;
    private Instant recordedAt;

    public GpsLocationResponse() {
    }

    public GpsLocationResponse(Long id, Long busId, double latitude, double longitude, Instant recordedAt) {
        this.id = id;
        this.busId = busId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getBusId() {
        return busId;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public Instant getRecordedAt() {
        return recordedAt;
    }
}


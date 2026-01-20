package com.smarttransport.gpsservice.dto;

public class GpsMetrics {
    private long trackedBuses;
    private long totalLocations;

    public GpsMetrics(long trackedBuses, long totalLocations) {
        this.trackedBuses = trackedBuses;
        this.totalLocations = totalLocations;
    }

    public long getTrackedBuses() {
        return trackedBuses;
    }

    public long getTotalLocations() {
        return totalLocations;
    }
}


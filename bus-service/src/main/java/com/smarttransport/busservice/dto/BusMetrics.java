package com.smarttransport.busservice.dto;

public class BusMetrics {
    private long total;
    private long inService;
    private long maintenance;
    private long outOfService;

    public BusMetrics(long total, long inService, long maintenance, long outOfService) {
        this.total = total;
        this.inService = inService;
        this.maintenance = maintenance;
        this.outOfService = outOfService;
    }

    public long getTotal() {
        return total;
    }

    public long getInService() {
        return inService;
    }

    public long getMaintenance() {
        return maintenance;
    }

    public long getOutOfService() {
        return outOfService;
    }
}


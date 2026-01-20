package com.smarttransport.ticketingservice.dto;

public class TicketMetrics {
    private long total;
    private long pending;
    private long paid;
    private long canceled;

    public TicketMetrics(long total, long pending, long paid, long canceled) {
        this.total = total;
        this.pending = pending;
        this.paid = paid;
        this.canceled = canceled;
    }

    public long getTotal() {
        return total;
    }

    public long getPending() {
        return pending;
    }

    public long getPaid() {
        return paid;
    }

    public long getCanceled() {
        return canceled;
    }
}


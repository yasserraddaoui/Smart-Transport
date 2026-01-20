package com.smarttransport.ticketingservice.dto;

import com.smarttransport.ticketingservice.domain.TicketStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class TicketResponse {
    private Long id;
    private String passengerName;
    private Long busId;
    private BigDecimal amount;
    private TicketStatus status;
    private Instant createdAt;

    public TicketResponse() {
    }

    public TicketResponse(Long id, String passengerName, Long busId, BigDecimal amount, TicketStatus status, Instant createdAt) {
        this.id = id;
        this.passengerName = passengerName;
        this.busId = busId;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public Long getBusId() {
        return busId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}


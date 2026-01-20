package com.smarttransport.busservice.dto;

import com.smarttransport.busservice.domain.BusStatus;

import java.time.Instant;

public class BusResponse {
    private Long id;
    private String busNumber;
    private String city;
    private String line;
    private String departure;
    private String arrival;
    private String company;
    private int capacity;
    private BusStatus status;
    private Instant createdAt;

    public BusResponse() {
    }

    public BusResponse(
            Long id,
            String busNumber,
            String city,
            String line,
            String departure,
            String arrival,
            String company,
            int capacity,
            BusStatus status,
            Instant createdAt
    ) {
        this.id = id;
        this.busNumber = busNumber;
        this.city = city;
        this.line = line;
        this.departure = departure;
        this.arrival = arrival;
        this.company = company;
        this.capacity = capacity;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public String getCity() {
        return city;
    }

    public String getLine() {
        return line;
    }

    public String getDeparture() {
        return departure;
    }

    public String getArrival() {
        return arrival;
    }

    public String getCompany() {
        return company;
    }

    public int getCapacity() {
        return capacity;
    }

    public BusStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

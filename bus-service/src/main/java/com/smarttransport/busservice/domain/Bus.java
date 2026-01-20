package com.smarttransport.busservice.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true, length = 20)
    private String busNumber;

    @Column(nullable = false, length = 40)
    private String city;

    @Column(name = "line_name", nullable = false, length = 60)
    private String line;

    @Column(nullable = false, length = 60)
    private String departure;

    @Column(nullable = false, length = 60)
    private String arrival;

    @Column(nullable = false, length = 40)
    private String company;

    @Column(nullable = false)
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BusStatus status = BusStatus.IN_SERVICE;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Bus() {
    }

    public Bus(String busNumber, String city, String line, String departure, String arrival, String company, int capacity, BusStatus status) {
        this.busNumber = busNumber;
        this.city = city;
        this.line = line;
        this.departure = departure;
        this.arrival = arrival;
        this.company = company;
        this.capacity = capacity;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLine() {
        return line;
    }

    public void setLine(String line) {
        this.line = line;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getArrival() {
        return arrival;
    }

    public void setArrival(String arrival) {
        this.arrival = arrival;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public BusStatus getStatus() {
        return status;
    }

    public void setStatus(BusStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

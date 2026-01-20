package com.smarttransport.gpsservice.service;

import com.smarttransport.gpsservice.domain.GpsLocation;
import com.smarttransport.gpsservice.dto.GpsMetrics;
import com.smarttransport.gpsservice.dto.GpsLocationRequest;
import com.smarttransport.gpsservice.repository.GpsLocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class GpsService {

    private final GpsLocationRepository repository;

    public GpsService(GpsLocationRepository repository) {
        this.repository = repository;
    }

    public List<GpsLocation> list(Long busId) {
        if (busId == null) return repository.findAll();
        return repository.findByBusIdOrderByRecordedAtDesc(busId);
    }

    public GpsLocation latest(Long busId) {
        return repository.findFirstByBusIdOrderByRecordedAtDesc(busId)
                .orElseThrow(() -> new NotFoundException("No GPS location found for this bus"));
    }

    @Transactional
    public GpsLocation create(GpsLocationRequest request) {
        GpsLocation loc = new GpsLocation(request.getBusId(), request.getLatitude(), request.getLongitude(), Instant.now());
        return repository.save(loc);
    }

    public GpsMetrics metrics() {
        return new GpsMetrics(repository.countDistinctBusId(), repository.count());
    }
}

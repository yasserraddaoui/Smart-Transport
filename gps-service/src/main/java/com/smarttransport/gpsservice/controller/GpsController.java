package com.smarttransport.gpsservice.controller;

import com.smarttransport.gpsservice.domain.GpsLocation;
import com.smarttransport.gpsservice.dto.GpsMetrics;
import com.smarttransport.gpsservice.dto.GpsLocationRequest;
import com.smarttransport.gpsservice.dto.GpsLocationResponse;
import com.smarttransport.gpsservice.service.GpsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gps")
public class GpsController {

    private final GpsService service;

    public GpsController(GpsService service) {
        this.service = service;
    }

    @GetMapping("/locations")
    public List<GpsLocationResponse> list(@RequestParam(required = false) Long busId) {
        return service.list(busId).stream().map(GpsController::toResponse).toList();
    }

    @GetMapping("/locations/latest")
    public GpsLocationResponse latest(@RequestParam Long busId) {
        return toResponse(service.latest(busId));
    }

    @PostMapping("/locations")
    @ResponseStatus(HttpStatus.CREATED)
    public GpsLocationResponse create(@Valid @RequestBody GpsLocationRequest request) {
        return toResponse(service.create(request));
    }

    @GetMapping("/metrics")
    public GpsMetrics metrics() {
        return service.metrics();
    }

    private static GpsLocationResponse toResponse(GpsLocation loc) {
        return new GpsLocationResponse(loc.getId(), loc.getBusId(), loc.getLatitude(), loc.getLongitude(), loc.getRecordedAt());
    }
}

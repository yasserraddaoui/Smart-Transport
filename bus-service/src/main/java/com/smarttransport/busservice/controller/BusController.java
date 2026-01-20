package com.smarttransport.busservice.controller;

import com.smarttransport.busservice.domain.Bus;
import com.smarttransport.busservice.dto.BusMetrics;
import com.smarttransport.busservice.dto.BusRequest;
import com.smarttransport.busservice.dto.BusResponse;
import com.smarttransport.busservice.service.BusService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bus")
public class BusController {

    private final BusService service;

    public BusController(BusService service) {
        this.service = service;
    }

    @GetMapping
    public List<BusResponse> list() {
        return service.list().stream().map(BusController::toResponse).toList();
    }

    @GetMapping("/{id}")
    public BusResponse get(@PathVariable Long id) {
        return toResponse(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BusResponse create(@Valid @RequestBody BusRequest request) {
        return toResponse(service.create(request));
    }

    @PutMapping("/{id}")
    public BusResponse update(@PathVariable Long id, @Valid @RequestBody BusRequest request) {
        return toResponse(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/metrics")
    public BusMetrics metrics() {
        return service.metrics();
    }

    private static BusResponse toResponse(Bus bus) {
        return new BusResponse(
                bus.getId(),
                bus.getBusNumber(),
                bus.getCity(),
                bus.getLine(),
                bus.getDeparture(),
                bus.getArrival(),
                bus.getCompany(),
                bus.getCapacity(),
                bus.getStatus(),
                bus.getCreatedAt()
        );
    }
}

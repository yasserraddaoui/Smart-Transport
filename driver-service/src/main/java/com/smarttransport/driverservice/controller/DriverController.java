package com.smarttransport.driverservice.controller;

import com.smarttransport.driverservice.domain.Driver;
import com.smarttransport.driverservice.dto.DriverMetrics;
import com.smarttransport.driverservice.dto.DriverRequest;
import com.smarttransport.driverservice.dto.DriverResponse;
import com.smarttransport.driverservice.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/driver")
public class DriverController {

    private final DriverService service;

    public DriverController(DriverService service) {
        this.service = service;
    }

    @GetMapping
    public List<DriverResponse> list() {
        return service.list().stream().map(DriverController::toResponse).toList();
    }

    @GetMapping("/{id}")
    public DriverResponse get(@PathVariable Long id) {
        return toResponse(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DriverResponse create(@Valid @RequestBody DriverRequest request) {
        return toResponse(service.create(request));
    }

    @PutMapping("/{id}")
    public DriverResponse update(@PathVariable Long id, @Valid @RequestBody DriverRequest request) {
        return toResponse(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/metrics")
    public DriverMetrics metrics() {
        return service.metrics();
    }

    private static DriverResponse toResponse(Driver driver) {
        return new DriverResponse(
                driver.getId(),
                driver.getFullName(),
                driver.getPhone(),
                driver.getLicenseNumber(),
                driver.getStatus(),
                driver.getCreatedAt()
        );
    }
}

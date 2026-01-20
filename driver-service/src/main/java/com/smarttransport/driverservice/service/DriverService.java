package com.smarttransport.driverservice.service;

import com.smarttransport.driverservice.domain.Driver;
import com.smarttransport.driverservice.domain.DriverStatus;
import com.smarttransport.driverservice.dto.DriverMetrics;
import com.smarttransport.driverservice.dto.DriverRequest;
import com.smarttransport.driverservice.repository.DriverRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class DriverService {

    private final DriverRepository repository;

    public DriverService(DriverRepository repository) {
        this.repository = repository;
    }

    public List<Driver> list() {
        return repository.findAll();
    }

    public Driver get(@NonNull Long id) {
        Long safeId = requireId(id);
        return repository.findById(safeId).orElseThrow(() -> new NotFoundException("Driver not found"));
    }

    @Transactional
    public Driver create(DriverRequest request) {
        Driver driver = new Driver(request.getFullName(), request.getPhone(), request.getLicenseNumber(), request.getStatus());
        try {
            return repository.save(driver);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("License number already exists");
        }
    }

    @Transactional
    public Driver update(@NonNull Long id, DriverRequest request) {
        Long safeId = requireId(id);
        Driver existing = get(safeId);
        existing.setFullName(request.getFullName());
        existing.setPhone(request.getPhone());
        existing.setLicenseNumber(request.getLicenseNumber());
        existing.setStatus(request.getStatus());
        try {
            return repository.save(existing);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("License number already exists");
        }
    }

    @Transactional
    public void delete(@NonNull Long id) {
        Long safeId = requireId(id);
        if (!repository.existsById(safeId)) throw new NotFoundException("Driver not found");
        repository.deleteById(safeId);
    }

    public DriverMetrics metrics() {
        long total = repository.count();
        long active = repository.countByStatus(DriverStatus.ACTIVE);
        long inactive = repository.countByStatus(DriverStatus.INACTIVE);
        return new DriverMetrics(total, active, inactive);
    }

    private static @NonNull Long requireId(@NonNull Long id) {
        return Objects.requireNonNull(id, "Driver id is required");
    }
}

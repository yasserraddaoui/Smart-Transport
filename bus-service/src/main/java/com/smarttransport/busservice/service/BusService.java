package com.smarttransport.busservice.service;

import com.smarttransport.busservice.domain.Bus;
import com.smarttransport.busservice.domain.BusStatus;
import com.smarttransport.busservice.dto.BusMetrics;
import com.smarttransport.busservice.dto.BusRequest;
import com.smarttransport.busservice.repository.BusRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class BusService {

    private final BusRepository repository;

    public BusService(BusRepository repository) {
        this.repository = repository;
    }

    public List<Bus> list() {
        return repository.findAll();
    }

    public Bus get(@NonNull Long id) {
        Long safeId = requireId(id);
        return repository.findById(safeId).orElseThrow(() -> new NotFoundException("Bus not found"));
    }

    @Transactional
    public Bus create(BusRequest request) {
        Bus bus = new Bus(
                request.getBusNumber(),
                request.getCity(),
                request.getLine(),
                request.getDeparture(),
                request.getArrival(),
                request.getCompany(),
                request.getCapacity(),
                request.getStatus()
        );
        try {
            return repository.save(bus);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Bus number already exists");
        }
    }

    @Transactional
    public Bus update(@NonNull Long id, BusRequest request) {
        Long safeId = requireId(id);
        Bus existing = get(safeId);
        existing.setBusNumber(request.getBusNumber());
        existing.setCity(request.getCity());
        existing.setLine(request.getLine());
        existing.setDeparture(request.getDeparture());
        existing.setArrival(request.getArrival());
        existing.setCompany(request.getCompany());
        existing.setCapacity(request.getCapacity());
        existing.setStatus(request.getStatus());
        try {
            return repository.save(existing);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Bus number already exists");
        }
    }

    @Transactional
    public void delete(@NonNull Long id) {
        Long safeId = requireId(id);
        if (!repository.existsById(safeId)) throw new NotFoundException("Bus not found");
        repository.deleteById(safeId);
    }

    public BusMetrics metrics() {
        long total = repository.count();
        long inService = repository.countByStatus(BusStatus.IN_SERVICE);
        long maintenance = repository.countByStatus(BusStatus.MAINTENANCE);
        long outOfService = repository.countByStatus(BusStatus.OUT_OF_SERVICE);
        return new BusMetrics(total, inService, maintenance, outOfService);
    }

    private static @NonNull Long requireId(@NonNull Long id) {
        return Objects.requireNonNull(id, "Bus id is required");
    }
}

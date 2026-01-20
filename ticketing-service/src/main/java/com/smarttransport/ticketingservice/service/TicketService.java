package com.smarttransport.ticketingservice.service;

import com.smarttransport.ticketingservice.domain.Ticket;
import com.smarttransport.ticketingservice.domain.TicketStatus;
import com.smarttransport.ticketingservice.dto.TicketMetrics;
import com.smarttransport.ticketingservice.dto.TicketRequest;
import com.smarttransport.ticketingservice.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class TicketService {

    private final TicketRepository repository;

    public TicketService(TicketRepository repository) {
        this.repository = repository;
    }

    public List<Ticket> list() {
        return repository.findAll();
    }

    public Ticket get(Long id) {
        Long safeId = requireId(id);
        return repository.findById(safeId).orElseThrow(() -> new NotFoundException("Ticket not found"));
    }

    @Transactional
    public Ticket create(TicketRequest request) {
        Ticket ticket = new Ticket(request.getPassengerName(), request.getBusId(), request.getAmount(), request.getStatus());
        return repository.save(ticket);
    }

    @Transactional
    public Ticket update(Long id, TicketRequest request) {
        Long safeId = requireId(id);
        Ticket existing = get(safeId);
        existing.setPassengerName(request.getPassengerName());
        existing.setBusId(request.getBusId());
        existing.setAmount(request.getAmount());
        existing.setStatus(request.getStatus());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Long safeId = requireId(id);
        if (!repository.existsById(safeId)) throw new NotFoundException("Ticket not found");
        repository.deleteById(safeId);
    }

    public TicketMetrics metrics() {
        long total = repository.count();
        long pending = repository.countByStatus(TicketStatus.PENDING);
        long paid = repository.countByStatus(TicketStatus.PAID);
        long canceled = repository.countByStatus(TicketStatus.CANCELED);
        return new TicketMetrics(total, pending, paid, canceled);
    }

    private static Long requireId(Long id) {
        return Objects.requireNonNull(id, "Ticket id is required");
    }
}

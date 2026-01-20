package com.smarttransport.ticketingservice.controller;

import com.smarttransport.ticketingservice.domain.Ticket;
import com.smarttransport.ticketingservice.dto.TicketMetrics;
import com.smarttransport.ticketingservice.dto.TicketRequest;
import com.smarttransport.ticketingservice.dto.TicketResponse;
import com.smarttransport.ticketingservice.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ticketing")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @GetMapping("/tickets")
    public List<TicketResponse> list() {
        return service.list().stream().map(TicketController::toResponse).toList();
    }

    @GetMapping("/tickets/{id}")
    public TicketResponse get(@PathVariable Long id) {
        return toResponse(service.get(id));
    }

    @PostMapping("/tickets")
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponse create(@Valid @RequestBody TicketRequest request) {
        return toResponse(service.create(request));
    }

    @PutMapping("/tickets/{id}")
    public TicketResponse update(@PathVariable Long id, @Valid @RequestBody TicketRequest request) {
        return toResponse(service.update(id, request));
    }

    @DeleteMapping("/tickets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/metrics")
    public TicketMetrics metrics() {
        return service.metrics();
    }

    private static TicketResponse toResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getPassengerName(),
                ticket.getBusId(),
                ticket.getAmount(),
                ticket.getStatus(),
                ticket.getCreatedAt()
        );
    }
}


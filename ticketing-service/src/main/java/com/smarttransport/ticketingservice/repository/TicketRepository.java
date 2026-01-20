package com.smarttransport.ticketingservice.repository;

import com.smarttransport.ticketingservice.domain.Ticket;
import com.smarttransport.ticketingservice.domain.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    long countByStatus(TicketStatus status);
}


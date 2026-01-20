package com.smarttransport.busservice.repository;

import com.smarttransport.busservice.domain.Bus;
import com.smarttransport.busservice.domain.BusStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Long> {
    boolean existsByBusNumber(String busNumber);
    long countByStatus(BusStatus status);
}

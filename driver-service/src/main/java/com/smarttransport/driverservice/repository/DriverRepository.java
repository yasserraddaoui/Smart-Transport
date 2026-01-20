package com.smarttransport.driverservice.repository;

import com.smarttransport.driverservice.domain.Driver;
import com.smarttransport.driverservice.domain.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    boolean existsByLicenseNumber(String licenseNumber);
    long countByStatus(DriverStatus status);
}

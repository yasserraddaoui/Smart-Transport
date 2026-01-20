package com.smarttransport.gpsservice.repository;

import com.smarttransport.gpsservice.domain.GpsLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GpsLocationRepository extends JpaRepository<GpsLocation, Long> {
    List<GpsLocation> findByBusIdOrderByRecordedAtDesc(Long busId);
    Optional<GpsLocation> findFirstByBusIdOrderByRecordedAtDesc(Long busId);

    @Query("select count(distinct g.busId) from GpsLocation g")
    long countDistinctBusId();
}

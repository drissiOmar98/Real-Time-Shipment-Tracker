package com.example.shipment_tracker.shipment.repository;

import com.example.shipment_tracker.shipment.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
  Optional<Shipment> findByTrackingNumber(String trackingNumber);

  // ✅ Check if a Tracking Number already exists
  boolean existsByTrackingNumber(String trackingNumber);

  // ✅ Check if another shipment (different ID) has the same tracking number — used in update validation
  boolean existsByTrackingNumberAndIdNot(String trackingNumber, Long id);
}
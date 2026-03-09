package com.example.shipment_tracker.shipment.repository;

import com.example.shipment_tracker.shipment.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
  Optional<Shipment> findByTrackingNumber(String trackingNumber);
}
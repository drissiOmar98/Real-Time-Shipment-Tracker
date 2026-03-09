package com.example.shipment_tracker.shipment.model;

import com.example.shipment_tracker.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shipment")
public class Shipment extends BaseEntity {

  @Column(nullable = false, unique = true)
  private String trackingNumber;

  @Column(nullable = false)
  private String origin;

  @Column(nullable = false)
  private String destination;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ShipmentStatus status;

  private String currentLocation;

  private String estimatedDelivery;

  @PrePersist
  protected void onCreate() {

    if (status == null) {
      status = ShipmentStatus.ORDER_PLACED;
    }
  }


}
package com.example.shipment_tracker.shipment.dto.response;

import com.example.shipment_tracker.shipment.model.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateMessage {
    private Long shipmentId;
    private String trackingNumber;
    private ShipmentStatus status;
    private String currentLocation;
    private LocalDateTime timestamp;
    private String message;
}

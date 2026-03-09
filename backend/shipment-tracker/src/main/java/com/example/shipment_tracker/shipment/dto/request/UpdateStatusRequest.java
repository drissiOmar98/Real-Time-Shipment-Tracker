package com.example.shipment_tracker.shipment.dto.request;

import com.example.shipment_tracker.shipment.model.ShipmentStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    private ShipmentStatus status;
    private String currentLocation;
}

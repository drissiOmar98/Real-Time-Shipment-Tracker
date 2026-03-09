package com.example.shipment_tracker.shipment.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateShipmentRequest {

    @NotBlank(message = "Origin is required")
    public String origin;

    @NotBlank(message = "Destination is required")
    public String destination;

    public String estimatedDelivery;



}


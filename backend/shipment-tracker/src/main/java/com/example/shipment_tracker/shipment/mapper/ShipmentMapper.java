package com.example.shipment_tracker.shipment.mapper;

import com.example.shipment_tracker.shipment.dto.request.CreateShipmentRequest;
import com.example.shipment_tracker.shipment.dto.response.ShipmentResponse;
import com.example.shipment_tracker.shipment.model.Shipment;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ShipmentMapper {

    // Request DTO -> Entity
    Shipment toEntity(CreateShipmentRequest dto);

    // Entity -> Response DTO
    ShipmentResponse toDto(Shipment shipment);
}

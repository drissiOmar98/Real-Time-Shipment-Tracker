package com.example.shipment_tracker.shipment.service;

import com.example.shipment_tracker.shipment.dto.request.CreateShipmentRequest;
import com.example.shipment_tracker.shipment.dto.request.UpdateStatusRequest;
import com.example.shipment_tracker.shipment.dto.response.ShipmentResponse;

import java.util.List;


public interface ShipmentService {

    ShipmentResponse createShipment(CreateShipmentRequest request);

    List<ShipmentResponse> getAllShipments();

    ShipmentResponse getShipmentById(Long id);

    ShipmentResponse getShipmentByTrackingNumber(String trackingNumber);

    ShipmentResponse updateShipmentStatus(UpdateStatusRequest request, Long id);

    void deleteShipment(Long id);

}

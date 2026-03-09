package com.example.shipment_tracker.shipment.service.Impl;

import com.example.shipment_tracker.exception.BusinessException;
import com.example.shipment_tracker.exception.ErrorCode;
import com.example.shipment_tracker.shipment.dto.request.CreateShipmentRequest;
import com.example.shipment_tracker.shipment.dto.request.UpdateStatusRequest;
import com.example.shipment_tracker.shipment.dto.response.ShipmentResponse;
import com.example.shipment_tracker.shipment.mapper.ShipmentMapper;
import com.example.shipment_tracker.shipment.model.Shipment;
import com.example.shipment_tracker.shipment.repository.ShipmentRepository;
import com.example.shipment_tracker.shipment.service.ShipmentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentMapper shipmentMapper;

    public ShipmentServiceImpl(ShipmentRepository shipmentRepository, ShipmentMapper shipmentMapper) {
        this.shipmentRepository = shipmentRepository;
        this.shipmentMapper = shipmentMapper;
    }


    @Override
    public ShipmentResponse createShipment(CreateShipmentRequest request) {

        // Convert DTO -> Entity
        Shipment shipment = shipmentMapper.toEntity(request);

        // Generate tracking number
        String trackingNumber = generateTrackingNumber();

        // Validate uniqueness
        validateUniqueFields(trackingNumber, null);

        // Set generated tracking number
        shipment.setTrackingNumber(trackingNumber);

        // Save entity
        Shipment savedShipment = shipmentRepository.save(shipment);

        // Convert Entity -> DTO
        return shipmentMapper.toDto(savedShipment);
    }

    private String generateTrackingNumber() {
        return "TRK-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }

    @Override
    public List<ShipmentResponse> getAllShipments() {
        List<Shipment> shipments = shipmentRepository.findAll();

        return shipments.stream()
                .map(shipmentMapper::toDto)
                .toList();
    }

    @Override
    public ShipmentResponse getShipmentById(Long id) {
        Shipment shipment = findShipmentById(id);
        return shipmentMapper.toDto(shipment);
    }

    @Override
    public ShipmentResponse getShipmentByTrackingNumber(String trackingNumber) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Shipment not found with tracking number: " + trackingNumber
                        )
                );

        return shipmentMapper.toDto(shipment);
    }


    @Override
    public ShipmentResponse updateShipmentStatus(UpdateStatusRequest request, Long id) {
        Shipment shipment = findShipmentById(id);

        shipment.setStatus(request.getStatus());

        if (request.getCurrentLocation() != null) {
            shipment.setCurrentLocation(request.getCurrentLocation());
        }

        Shipment updatedShipment = shipmentRepository.save(shipment);

        return shipmentMapper.toDto(updatedShipment);
    }


    @Override
    public void deleteShipment(Long id) {
        Shipment shipment = findShipmentById(id);

        shipmentRepository.delete(shipment);
    }

    private void validateUniqueFields(String trackingNumber, Long id) {

        if (id == null) {
            // CREATE
            if (shipmentRepository.existsByTrackingNumber(trackingNumber)) {
                throw new BusinessException(ErrorCode.TRACKING_NUMBER_ALREADY_EXISTS,trackingNumber);
            }

        } else {
            // UPDATE
            if (shipmentRepository.existsByTrackingNumberAndIdNot(trackingNumber, id)) {
                throw new BusinessException(ErrorCode.TRACKING_NUMBER_ALREADY_EXISTS,trackingNumber);
            }
        }
    }

    private Shipment findShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Shipment not found with ID: " + id));
    }
}

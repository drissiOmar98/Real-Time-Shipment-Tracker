package com.example.shipment_tracker.shipment.service.Impl;

import com.example.shipment_tracker.exception.BusinessException;
import com.example.shipment_tracker.exception.ErrorCode;
import com.example.shipment_tracker.shipment.dto.request.CreateShipmentRequest;
import com.example.shipment_tracker.shipment.dto.request.UpdateStatusRequest;
import com.example.shipment_tracker.shipment.dto.response.ShipmentResponse;
import com.example.shipment_tracker.shipment.dto.response.StatusUpdateMessage;
import com.example.shipment_tracker.shipment.mapper.ShipmentMapper;
import com.example.shipment_tracker.shipment.model.Shipment;
import com.example.shipment_tracker.shipment.model.ShipmentStatus;
import com.example.shipment_tracker.shipment.repository.ShipmentRepository;
import com.example.shipment_tracker.shipment.service.ShipmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentMapper shipmentMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public ShipmentServiceImpl(ShipmentRepository shipmentRepository, ShipmentMapper shipmentMapper, SimpMessagingTemplate messagingTemplate) {
        this.shipmentRepository = shipmentRepository;
        this.shipmentMapper = shipmentMapper;
        this.messagingTemplate = messagingTemplate;
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

    /**
     * Publishes a realtime shipment status update to WebSocket subscribers.
     *
     * <p>This method builds a {@link StatusUpdateMessage} payload containing the
     * latest shipment information and broadcasts it through the configured
     * WebSocket message broker.</p>
     *
     * <p>Two topics are used:</p>
     * <ul>
     *   <li><b>/topic/shipments</b> – broadcasts updates for all shipments.</li>
     *   <li><b>/topic/shipments/{shipmentId}</b> – sends updates specific to a single shipment.</li>
     * </ul>
     *
     * <p>This enables connected clients (e.g., the Angular dashboard) to receive
     * instant shipment status updates without polling the server.</p>
     *
     * @param shipment the shipment entity containing the latest state
     * @param message  a descriptive message associated with the status update
     */
    public void notifyShipmentStatus(Shipment shipment, String message) {
        var update = StatusUpdateMessage.builder()
                .shipmentId(shipment.getId())
                .trackingNumber(shipment.getTrackingNumber())
                .status(shipment.getStatus())
                .currentLocation(shipment.getCurrentLocation())
                .timestamp(shipment.getUpdatedAt())
                .message(message)
                .build();

        messagingTemplate.convertAndSend("/topic/shipments", update);
        messagingTemplate.convertAndSend("/topic/shipments" + shipment.getId(), update);

        log.info("Sent shipment status update: {}", update);
    }

    /**
     * Returns a human-readable message describing the current shipment status.
     *
     * <p>This method maps a {@link ShipmentStatus} value to a descriptive message
     * that can be used in notifications, logs, or WebSocket updates sent to clients.
     * It ensures that each shipment lifecycle state has a clear message that can
     * be displayed in the frontend dashboard.</p>
     *
     * @param status the current shipment status
     * @return a descriptive message corresponding to the shipment status
     */
    private String getStatusMessage(ShipmentStatus status) {
        return switch (status) {
            case ORDER_PLACED -> "Order has been placed";
            case PROCESSING -> "Order is being processed";
            case PICKED_UP -> "Package has been picked up";
            case IN_TRANSIT -> "Package is in transit";
            case OUT_FOR_DELIVERY -> "Package is out for delivery";
            case DELIVERED -> "Package has been delivered";
            case EXCEPTION -> "Delivery exception occurred";
        };
    }
}

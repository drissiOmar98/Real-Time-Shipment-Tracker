/**
 * Supported shipment statuses.
 *
 * This constant defines all possible states a shipment can have
 * throughout its lifecycle in the system. It mirrors the backend
 * ShipmentStatus enum to ensure consistency between the frontend
 * and Spring Boot API.
 */
export const SHIPMENT_STATUS = {
  ORDER_PLACED: 'ORDER_PLACED',
  PROCESSING: 'PROCESSING',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  EXCEPTION: 'EXCEPTION',
} as const;

/**
 * Type representing valid shipment status keys.
 */
export type ShipmentStatus = keyof typeof SHIPMENT_STATUS;


/**
 * Represents a shipment entity returned from the backend API.
 */
export interface Shipment {
  id: number;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  currentLocation: string;
  estimatedDelivery?: string;
}

/**
 * Request payload used to create a new shipment.
 */
export interface CreateShipmentRequest {
  origin: string;
  destination: string;
  estimatedDelivery?: string;
}

/**
 * Request payload used to update the shipment status.
 */
export interface UpdateStatusRequest {
  status: ShipmentStatus;
  currentLocation?: string;
}

/**
 * WebSocket message received when a shipment status is updated in real time.
 *
 * This message is sent from the backend via STOMP/WebSocket and
 * allows the frontend dashboard to update shipment status instantly
 * without requiring a page refresh.
 */
export interface StatusUpdateMessage {
  shipmentId: number;
  trackingNumber: string;
  status: ShipmentStatus;
  currentLocation: string;
  timestamp: string;
  message: string;
}

/**
 * Human-readable labels for shipment statuses.
 *
 * Used in UI components such as shipment grids and notifications
 * to display friendly status text instead of enum values.
 */
export const STATUS_LABELS: Readonly<Record<ShipmentStatus, string>> = {
  [SHIPMENT_STATUS.ORDER_PLACED]: 'Order Placed',
  [SHIPMENT_STATUS.PROCESSING]: 'Processing',
  [SHIPMENT_STATUS.PICKED_UP]: 'Picked Up',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'In Transit',
  [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [SHIPMENT_STATUS.DELIVERED]: 'Delivered',
  [SHIPMENT_STATUS.EXCEPTION]: 'Exception',
};

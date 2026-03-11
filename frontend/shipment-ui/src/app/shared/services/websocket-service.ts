import {DestroyRef, inject, Injectable} from '@angular/core';
import {Client, StompSubscription, Versions} from '@stomp/stompjs';
import {BehaviorSubject, Observable} from 'rxjs';
import {StatusUpdateMessage} from '../models/shipment.model';

/**
 * 🛰 WebsocketService
 *
 * Handles real-time communication with the backend using STOMP over WebSocket.
 * This service connects to the Spring Boot WebSocket endpoint (`/ws`) and subscribes
 * to shipment updates (`/topic/shipments`) to provide real-time shipment status.
 *
 * Features:
 * - Automatic reconnection
 * - Heartbeat management
 * - Tracks connection status
 * - Provides observable streams for components to react to updates
 */
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  /** 🚀 Angular destroy ref to clean up subscriptions when component/service is destroyed */
  private destroyRef = inject(DestroyRef);

  /** 🧩 STOMP client instance */
  private client!: Client;

  /** 🔌 Connection status observable */
  private connected$ = new BehaviorSubject<boolean>(false);

  /** 📡 Latest shipment status update observable */
  private statusUpdate$ = new BehaviorSubject<null | StatusUpdateMessage>(null);

  /** 📋 Map of active STOMP subscriptions to manage unsubscription */
  private subscriptions = new Map<string, StompSubscription>();

  constructor() {
    // Initialize the STOMP client
    this.initClient();
    // Clean up when service is destroyed
    this.destroyRef.onDestroy(() => {
      this.disconnect();
      this.statusUpdate$.complete();
      this.connected$.complete();
    });
  }


}

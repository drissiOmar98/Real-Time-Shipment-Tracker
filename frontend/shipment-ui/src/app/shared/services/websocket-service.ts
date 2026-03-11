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

  /**
   * 🔧 Initialize STOMP client configuration
   *
   * Configures broker URL, heartbeat, reconnection, and all event handlers.
   */
  initClient(): void {
    this.client = new Client({
      brokerURL: 'http://localhost:8080/ws', // WebSocket endpoint
      stompVersions: Versions.default,       // Default STOMP version
      reconnectDelay: 5000,                  // Attempt reconnect every 5s
      heartbeatIncoming: 10000,              // Expect ping every 10s
      heartbeatOutgoing: 10000,              // Send ping every 10s
      connectionTimeout: 10000,              // Connection timeout

      // ✅ Called when STOMP connection is successfully established
      onConnect: (frame) => {
        console.log('[Websocket] Connected!!');
        this.connected$.next(true);
        this.subscripeToTopics();
      },

       // ❌ Called when STOMP connection disconnects
      onDisconnect: () => {
        console.log('[Websocket] Disconnected');
        this.connected$.next(false);
        this.subscriptions.clear();
      },

      // ⚠️ Handle STOMP protocol errors
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame.headers['message']);
        console.error('[WebSocket] Error details:', frame.body);
        this.connected$.next(false);
      },

      // ⚠️ Handle low-level WebSocket errors
      onWebSocketError: (event) => {
        console.error('[WebSocket] WebSocket error:', event);
        this.connected$.next(false);
      },

      // 🔒 Handle WebSocket closure
      onWebSocketClose: (event) => {
        console.log('[WebSocket] WebSocket closed:', event.code, event.reason);
        this.connected$.next(false);
      },
    });
  }

  /**
   * 🔌 Connect to WebSocket server
   *
   * Activates the STOMP client if not already connected.
   */
  connect(): void {
    if (this.client.active) {
      console.log('[Websocket] Already connected or connecting');
      return;
    }

    this.client.activate();
  }

   /**
   * ✂️ Disconnect from WebSocket server
   *
   * Unsubscribes from all topics and deactivates the STOMP client.
   */
  disconnect(): void {
    if (this.client.active) {
      console.log('[WebSocket] Disconnecting...');

         // Unsubscribe from all active topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Deactivate the client
      this.client.deactivate();
    }
  }



}

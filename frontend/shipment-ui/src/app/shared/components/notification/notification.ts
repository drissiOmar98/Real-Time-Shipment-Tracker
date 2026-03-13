import {Component, DestroyRef, inject, signal} from '@angular/core';
import {SHIPMENT_STATUS, ShipmentStatus, STATUS_LABELS, StatusUpdateMessage} from '../../models/shipment.model';
import {WebsocketService} from '../../services/websocket-service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DatePipe, NgClass} from '@angular/common';

/**
 * 🔔 Notification Component
 *
 * Displays real-time shipment status notifications received from the WebSocket server.
 * This component listens to updates emitted by the WebsocketService and dynamically
 * adds new notifications to the top of the notification list.
 *
 * Key Features:
 * 📡 Subscribes to real-time shipment updates via WebSocket
 * ⚡ Uses Angular Signals for reactive notification state management
 * 🎨 Applies dynamic status badge styling using NgClass and Tailwind CSS
 * 🕒 Formats timestamps using Angular DatePipe
 * 🧹 Automatically cleans up subscriptions using DestroyRef + takeUntilDestroyed
 *
 * Workflow:
 * 1. Component subscribes to `getStatusUpdates()` from WebsocketService
 * 2. When a new status update is received, it is pushed to the notifications signal
 * 3. The UI automatically updates and displays the latest notification at the top
 *
 * This component works together with:
 * - WebsocketService for real-time data streaming
 * - ShipmentGrid for updating shipment statuses
 * - Header component for connection status visualization
 */
@Component({
  selector: 'app-notification',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {

  private destroyRef = inject(DestroyRef);
  private websocketService = inject(WebsocketService);
  STATUS_LABELS = STATUS_LABELS;
  notifications = signal<StatusUpdateMessage[]>([]);

  readonly STATUS_BADGE_CLASS_MAP: Record<ShipmentStatus, string> = {
    [SHIPMENT_STATUS.ORDER_PLACED]: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    [SHIPMENT_STATUS.PROCESSING]: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    [SHIPMENT_STATUS.PICKED_UP]: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
    [SHIPMENT_STATUS.IN_TRANSIT]: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20',
    [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
    [SHIPMENT_STATUS.DELIVERED]: 'bg-green-500/10 text-green-400 ring-green-500/20',
    [SHIPMENT_STATUS.EXCEPTION]: 'bg-red-500/10 text-red-400 ring-red-500/20',
  };

  getStatusBadgeClass(status: ShipmentStatus): string {
    return this.STATUS_BADGE_CLASS_MAP[status];
  }

  ngOnInit(): void {
    this.handleUpdate();
  }

  /**
   * 📥 Handles incoming WebSocket updates and prepends them to the notification list.
   */
  private handleUpdate(): void {
    this.websocketService
      .getStatusUpdates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((update) => {
        if (update) {
          this.notifications.update((notifications) => [update, ...notifications]);
        }
      });
  }

}

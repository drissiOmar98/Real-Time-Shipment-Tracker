import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CreateShipment} from './features/shipments/create-shipment/create-shipment';
import {ShipmentGrid} from './features/shipments/shipment-grid/shipment-grid';
import {UpdateShipment} from './features/shipments/update-shipment/update-shipment';
import {Header} from './layout/header/header';
import {Notification} from './shared/components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [CreateShipment, ShipmentGrid, UpdateShipment, Header, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shipment-ui');
}

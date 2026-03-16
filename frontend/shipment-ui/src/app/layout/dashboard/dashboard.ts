import { Component } from '@angular/core';
import {ShipmentGrid} from '../../features/shipments/shipment-grid/shipment-grid';
import {Notification} from '../../shared/components/notification/notification';
import {UpdateShipment} from '../../features/shipments/update-shipment/update-shipment';
import {CreateShipment} from '../../features/shipments/create-shipment/create-shipment';

@Component({
  selector: 'app-dashboard',
  imports: [
    ShipmentGrid,
    Notification,
    UpdateShipment,
    CreateShipment
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}

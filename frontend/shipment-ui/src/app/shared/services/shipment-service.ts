import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateShipmentRequest, Shipment, UpdateStatusRequest} from '../models/shipment.model';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

/**
 * Service responsible for communicating with the Shipment API.
 *
 * This service acts as the frontend gateway to the backend
 * Spring Boot Shipment REST API. It handles all HTTP requests
 * related to shipment operations such as creating shipments,
 * retrieving shipment data, and updating shipment status.
 */
@Injectable({
  providedIn: 'root',
})
export class ShipmentService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shipments`;

  createShipment(request: CreateShipmentRequest): Observable<Shipment> {
    return this.http.post<Shipment>(this.apiUrl, request);
  }
  getAllShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.apiUrl);
  }
  getShipmentById(id: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/${id}`);
  }
   getShipmentByTrackingNumber(trackingNumber: string): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/track/${trackingNumber}`);
  }

  updateShipment(id: number, request: UpdateStatusRequest): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.apiUrl}/${id}/status`, request);
  }


}

import {Component, inject, OnInit, signal} from '@angular/core';
import {Shipment, SHIPMENT_STATUS, STATUS_LABELS} from '../../../shared/models/shipment.model';
import {ShipmentService} from '../../../shared/services/shipment-service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, of} from 'rxjs';

/**
 * Component responsible for updating the status of an existing shipment.
 *
 * This component allows users to select a shipment, update its status,
 * and optionally update the current location. It retrieves available
 * shipments from the backend and displays them in a selectable list.
 *
 * Angular Signals are used to manage component state such as loading,
 * submission progress, and error handling.
 */
@Component({
  selector: 'app-update-shipment',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './update-shipment.html',
  styleUrl: './update-shipment.css',
})
export class UpdateShipment implements OnInit {

  private fb = inject(FormBuilder);
  private shipmentService = inject(ShipmentService);

  /** Human readable labels for shipment statuses */
  STATUS_LABELS = STATUS_LABELS;

  /** Available status options */
  statusOptions = Object.values(SHIPMENT_STATUS);

   /** Signal storing the list of shipments */
  shipments = signal<Shipment[]>([]);

  /** Signal used to display API or processing errors */
  errorMessage = signal<string>('');

  /** Signal controlling loading state when fetching shipments */
  isLoading = signal<boolean>(false);

  /** Signal preventing duplicate submissions */
  isSubmitting = signal<boolean>(false);

  /**
   * Reactive form used to update shipment status.
   */
  updateForm: FormGroup = this.fb.group({
    shipmentId: [null, Validators.required],
    status: [SHIPMENT_STATUS.PROCESSING, Validators.required],
    currentLocation: [''],
  });

   /**
   * Updates the shipment status using the backend API.
   *
   * Validates the form and prevents duplicate submissions
   * while the request is being processed.
   */
  updateShipment(): void {
    if (this.updateForm.invalid || this.isSubmitting()) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const { shipmentId, status, currentLocation } = this.updateForm.value;
    this.shipmentService
      .updateShipment(shipmentId, { status, currentLocation })
      .pipe(
        catchError((error) => {
          this.errorMessage.set('Failed to load shipments');
          console.error('error:', error);
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result !== null) {
          this.updateForm.reset({
            shipmentId: null,
            status: SHIPMENT_STATUS.PROCESSING,
            currentLocation: '',
          });
        }
        this.isSubmitting.set(false);
      });
  }

  /**
   * Updates the form when a shipment ID is selected.
   *
   * Automatically fills the current location field
   * based on the selected shipment.
   */
  onSelectShipmentId() {
    const shipmentId = this.updateForm.get('shipmentId')?.value;

    if (!shipmentId) return;

    const selectedShipment = this.shipments().find((shipment) => shipment.id === shipmentId);
    if (selectedShipment) {
      this.updateForm.patchValue({
        currentLocation: selectedShipment.currentLocation || '',
      });
    }
  }

  /**
   * Lifecycle hook executed when the component initializes.
   * Loads shipments from the backend.
   */
  ngOnInit(): void {
    this.loadShipment();
  }


  /**
   * Fetches all shipments from the backend API.
   */
  loadShipment(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.shipmentService
      .getAllShipments()
      .pipe(
        catchError((error) => {
          this.errorMessage.set('Failed to load shipments');
          console.error('error:', error);
          return of([]);
        }),
      )
      .subscribe((shipments) => {
        this.shipments.set(shipments);
        this.isLoading.set(false);
      });
  }

  /**
   * Checks whether a form field contains validation errors.
   */
  hasError(fieldName: string): boolean {
    const field = this.updateForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Returns a validation error message for a specific field.
   */
  getErrorMessage(fieldName: string): string {
    const field = this.updateForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'This field is required';
    }

    return '';
  }





}

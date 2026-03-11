import {Component, inject, signal} from '@angular/core';
import {ShipmentService} from '../../../shared/services/shipment-service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateShipmentRequest} from '../../../shared/models/shipment.model';
import {catchError, of} from 'rxjs';


/**
 * Component responsible for creating a new shipment.
 *
 * Provides a reactive form that allows users to input shipment details
 * such as origin, destination, and estimated delivery date. The component
 * validates user input before sending the request to the backend API
 * through the ShipmentService.
 */
@Component({
  selector: 'app-create-shipment',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-shipment.html',
  styleUrl: './create-shipment.css',
})
export class CreateShipment {
  private shipmentService = inject(ShipmentService);
  private fb = inject(FormBuilder);

  /** Signal used to control submission state and prevent duplicate requests */
  isSubmitting = signal(false);

  /**
   * Reactive form used to capture shipment creation data.
   */
  shipmentForm: FormGroup = this.fb.group({
    origin: ['', [Validators.required, Validators.minLength(2)]],
    destination: ['', [Validators.required, Validators.minLength(2)]],
    estimatedDelivery: [''],
  });

  /**
   * Handles shipment creation.
   *
   * Validates the form and sends the request to the backend.
   * Prevents duplicate submissions while the request is processing.
   */
  createShipment(): void {
    if (this.shipmentForm.invalid || this.isSubmitting()) {
      this.shipmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const shipment: CreateShipmentRequest = this.shipmentForm.value;
    this.shipmentService
      .createShipment(shipment)
      .pipe(
        catchError(() => {
          this.isSubmitting.set(false);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.shipmentForm.reset();
        this.isSubmitting.set(false);
      });
  }

  /**
   * Checks if a form field contains validation errors.
   *
   * @param fieldName name of the form control
   * @returns true if the field is invalid and touched
   */
  hasError(fieldName: string): boolean {
    const field = this.shipmentForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Returns a user-friendly validation message for a form field.
   *
   * @param fieldName name of the form control
   * @returns validation error message
   */
  getErrorMessage(fieldName: string): string {
    const field = this.shipmentForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('minlength')) {
      return 'Please enter at least 2 characters';
    }
    return '';
  }


}

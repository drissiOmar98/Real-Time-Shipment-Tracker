import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentGrid } from './shipment-grid';

describe('ShipmentGrid', () => {
  let component: ShipmentGrid;
  let fixture: ComponentFixture<ShipmentGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShipment } from './update-shipment';

describe('UpdateShipment', () => {
  let component: UpdateShipment;
  let fixture: ComponentFixture<UpdateShipment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateShipment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateShipment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

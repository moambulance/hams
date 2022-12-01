import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicineDeliveryComponent } from './add-medicine-delivery.component';

describe('AddMedicineDeliveryComponent', () => {
  let component: AddMedicineDeliveryComponent;
  let fixture: ComponentFixture<AddMedicineDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMedicineDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMedicineDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

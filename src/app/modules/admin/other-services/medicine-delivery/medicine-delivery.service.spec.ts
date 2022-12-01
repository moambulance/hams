import { TestBed } from '@angular/core/testing';

import { MedicineDeliveryService } from './medicine-delivery.service';

describe('MedicineDeliveryService', () => {
  let service: MedicineDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicineDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

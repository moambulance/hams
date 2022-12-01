import { TestBed } from '@angular/core/testing';

import { HospitalAvailableServicesService } from './hospital-available-services.service';

describe('HospitalAvailableServicesService', () => {
  let service: HospitalAvailableServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalAvailableServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

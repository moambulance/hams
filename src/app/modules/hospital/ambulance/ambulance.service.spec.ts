import { TestBed } from '@angular/core/testing';

import { AmbulanceService } from './ambulance.service';

describe('AmbulanceService', () => {
  let service: AmbulanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbulanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

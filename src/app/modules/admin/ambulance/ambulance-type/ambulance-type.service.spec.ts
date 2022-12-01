import { TestBed } from '@angular/core/testing';

import { AmbulanceTypeService } from './ambulance-type.service';

describe('AmbulanceTypeService', () => {
  let service: AmbulanceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbulanceTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

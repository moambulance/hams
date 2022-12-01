import { TestBed } from '@angular/core/testing';

import { TotalRidesService } from './total-rides.service';

describe('TotalRidesService', () => {
  let service: TotalRidesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalRidesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

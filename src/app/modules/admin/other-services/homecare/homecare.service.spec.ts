import { TestBed } from '@angular/core/testing';

import { HomecareService } from './homecare.service';

describe('HomecareService', () => {
  let service: HomecareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomecareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

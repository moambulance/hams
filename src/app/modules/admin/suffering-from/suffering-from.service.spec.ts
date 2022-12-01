import { TestBed } from '@angular/core/testing';

import { SufferingFromService } from './suffering-from.service';

describe('SufferingFromService', () => {
  let service: SufferingFromService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SufferingFromService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

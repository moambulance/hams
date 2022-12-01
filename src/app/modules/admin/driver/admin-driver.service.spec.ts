import { TestBed } from '@angular/core/testing';

import { AdminDriverService } from './admin-driver.service';

describe('AdminDriverService', () => {
  let service: AdminDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

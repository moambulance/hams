import { TestBed } from '@angular/core/testing';

import { HospitalHeTypesService } from './hospital-he-types.service';

describe('HospitalHeTypesService', () => {
  let service: HospitalHeTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalHeTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

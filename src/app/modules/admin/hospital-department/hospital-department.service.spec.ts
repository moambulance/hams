import { TestBed } from '@angular/core/testing';

import { HospitalDepartmentService } from './hospital-department.service';

describe('HospitalDepartmentService', () => {
  let service: HospitalDepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalDepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DoctorConsultationService } from './doctor-consultation.service';

describe('DoctorConsultationService', () => {
  let service: DoctorConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorConsultationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SpecialistTypeService } from './specialist-type.service';

describe('SpecialistTypeService', () => {
  let service: SpecialistTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialistTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { IotCompaniesService } from './iot-companies.service';

describe('IotCompaniesService', () => {
  let service: IotCompaniesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IotCompaniesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

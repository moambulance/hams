import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAvailableServicesComponent } from './hospital-available-services.component';

describe('HospitalAvailableServicesComponent', () => {
  let component: HospitalAvailableServicesComponent;
  let fixture: ComponentFixture<HospitalAvailableServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalAvailableServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalAvailableServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

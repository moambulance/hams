import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalToHospitalComponent } from './hospital-to-hospital.component';

describe('HospitalToHospitalComponent', () => {
  let component: HospitalToHospitalComponent;
  let fixture: ComponentFixture<HospitalToHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalToHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalToHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

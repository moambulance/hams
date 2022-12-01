import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardedHospitalComponent } from './onboarded-hospital.component';

describe('OnboardedHospitalComponent', () => {
  let component: OnboardedHospitalComponent;
  let fixture: ComponentFixture<OnboardedHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardedHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardedHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

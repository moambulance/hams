import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLocationComponent } from './patient-location.component';

describe('PatientLocationComponent', () => {
  let component: PatientLocationComponent;
  let fixture: ComponentFixture<PatientLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

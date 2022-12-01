import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoAmbulancePatientComponent } from './mo-ambulance-patient.component';

describe('MoAmbulancePatientComponent', () => {
  let component: MoAmbulancePatientComponent;
  let fixture: ComponentFixture<MoAmbulancePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoAmbulancePatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoAmbulancePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

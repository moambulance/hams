import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorConsultationComponent } from './add-doctor-consultation.component';

describe('AddDoctorConsultationComponent', () => {
  let component: AddDoctorConsultationComponent;
  let fixture: ComponentFixture<AddDoctorConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoctorConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDoctorConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

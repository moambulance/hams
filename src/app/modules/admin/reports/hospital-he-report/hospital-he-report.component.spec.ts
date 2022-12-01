import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalHeReportComponent } from './hospital-he-report.component';

describe('HospitalHeReportComponent', () => {
  let component: HospitalHeReportComponent;
  let fixture: ComponentFixture<HospitalHeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalHeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalHeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

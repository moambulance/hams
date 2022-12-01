import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceReportComponent } from './ambulance-report.component';

describe('AmbulanceReportComponent', () => {
  let component: AmbulanceReportComponent;
  let fixture: ComponentFixture<AmbulanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmbulanceReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

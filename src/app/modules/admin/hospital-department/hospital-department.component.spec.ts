import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalDepartmentComponent } from './hospital-department.component';

describe('HospitalDepartmentComponent', () => {
  let component: HospitalDepartmentComponent;
  let fixture: ComponentFixture<HospitalDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

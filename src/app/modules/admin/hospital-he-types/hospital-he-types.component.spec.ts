import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalHeTypesComponent } from './hospital-he-types.component';

describe('HospitalHeTypesComponent', () => {
  let component: HospitalHeTypesComponent;
  let fixture: ComponentFixture<HospitalHeTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalHeTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalHeTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

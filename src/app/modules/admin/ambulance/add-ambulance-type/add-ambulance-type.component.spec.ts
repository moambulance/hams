import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAmbulanceTypeComponent } from './add-ambulance-type.component';

describe('AddAmbulanceTypeComponent', () => {
  let component: AddAmbulanceTypeComponent;
  let fixture: ComponentFixture<AddAmbulanceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAmbulanceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAmbulanceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

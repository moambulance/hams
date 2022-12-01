import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAmbulanceDetailsComponent } from './add-ambulance-details.component';

describe('AddAmbulanceDetailsComponent', () => {
  let component: AddAmbulanceDetailsComponent;
  let fixture: ComponentFixture<AddAmbulanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAmbulanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAmbulanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

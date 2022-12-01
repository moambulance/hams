import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceTypeComponent } from './ambulance-type.component';

describe('AmbulanceTypeComponent', () => {
  let component: AmbulanceTypeComponent;
  let fixture: ComponentFixture<AmbulanceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbulanceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

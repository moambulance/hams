import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceRevenueComponent } from './ambulance-revenue.component';

describe('AmbulanceRevenueComponent', () => {
  let component: AmbulanceRevenueComponent;
  let fixture: ComponentFixture<AmbulanceRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbulanceRevenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

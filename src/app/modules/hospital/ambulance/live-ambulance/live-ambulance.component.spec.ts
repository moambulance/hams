import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAmbulanceComponent } from './live-ambulance.component';

describe('LiveAmbulanceComponent', () => {
  let component: LiveAmbulanceComponent;
  let fixture: ComponentFixture<LiveAmbulanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveAmbulanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAmbulanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

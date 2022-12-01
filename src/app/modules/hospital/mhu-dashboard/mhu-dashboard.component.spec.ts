import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MhuDashboardComponent } from './mhu-dashboard.component';

describe('MhuDashboardComponent', () => {
  let component: MhuDashboardComponent;
  let fixture: ComponentFixture<MhuDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MhuDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MhuDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

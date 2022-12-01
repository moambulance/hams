import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvitalsDashboardComponent } from './mvitals-dashboard.component';

describe('MvitalsDashboardComponent', () => {
  let component: MvitalsDashboardComponent;
  let fixture: ComponentFixture<MvitalsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MvitalsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvitalsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

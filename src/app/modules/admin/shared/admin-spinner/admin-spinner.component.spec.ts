import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpinnerComponent } from './admin-spinner.component';

describe('AdminSpinnerComponent', () => {
  let component: AdminSpinnerComponent;
  let fixture: ComponentFixture<AdminSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

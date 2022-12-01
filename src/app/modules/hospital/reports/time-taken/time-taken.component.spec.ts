import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTakenComponent } from './time-taken.component';

describe('TimeTakenComponent', () => {
  let component: TimeTakenComponent;
  let fixture: ComponentFixture<TimeTakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeTakenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

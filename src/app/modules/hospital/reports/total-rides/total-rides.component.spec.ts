import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRidesComponent } from './total-rides.component';

describe('TotalRidesComponent', () => {
  let component: TotalRidesComponent;
  let fixture: ComponentFixture<TotalRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalRidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

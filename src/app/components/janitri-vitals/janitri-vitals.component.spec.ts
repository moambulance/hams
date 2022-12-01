import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JanitriVitalsComponent } from './janitri-vitals.component';

describe('JanitriVitalsComponent', () => {
  let component: JanitriVitalsComponent;
  let fixture: ComponentFixture<JanitriVitalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JanitriVitalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JanitriVitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

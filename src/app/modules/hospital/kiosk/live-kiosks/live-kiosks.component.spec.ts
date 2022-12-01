import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveKiosksComponent } from './live-kiosks.component';

describe('LiveKiosksComponent', () => {
  let component: LiveKiosksComponent;
  let fixture: ComponentFixture<LiveKiosksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveKiosksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveKiosksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

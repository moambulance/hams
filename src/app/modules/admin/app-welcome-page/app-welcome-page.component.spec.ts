import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppWelcomePageComponent } from './app-welcome-page.component';

describe('AppWelcomePageComponent', () => {
  let component: AppWelcomePageComponent;
  let fixture: ComponentFixture<AppWelcomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppWelcomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppWelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

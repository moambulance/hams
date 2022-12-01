import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistTypeComponent } from './specialist-type.component';

describe('SpecialistTypeComponent', () => {
  let component: SpecialistTypeComponent;
  let fixture: ComponentFixture<SpecialistTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialistTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialistTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

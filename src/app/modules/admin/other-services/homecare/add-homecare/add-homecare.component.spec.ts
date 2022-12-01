import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHomecareComponent } from './add-homecare.component';

describe('AddHomecareComponent', () => {
  let component: AddHomecareComponent;
  let fixture: ComponentFixture<AddHomecareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHomecareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHomecareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvertiseComponent } from './add-advertise.component';

describe('AddAdvertiseComponent', () => {
  let component: AddAdvertiseComponent;
  let fixture: ComponentFixture<AddAdvertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdvertiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdvertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

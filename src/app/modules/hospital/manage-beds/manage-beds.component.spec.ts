import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBedsComponent } from './manage-beds.component';

describe('ManageBedsComponent', () => {
  let component: ManageBedsComponent;
  let fixture: ComponentFixture<ManageBedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

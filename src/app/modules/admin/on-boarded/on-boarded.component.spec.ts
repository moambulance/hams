import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardedComponent } from './on-boarded.component';

describe('OnBoardedComponent', () => {
  let component: OnBoardedComponent;
  let fixture: ComponentFixture<OnBoardedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnBoardedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnBoardedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

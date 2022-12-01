import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SufferingFromComponent } from './suffering-from.component';

describe('SufferingFromComponent', () => {
  let component: SufferingFromComponent;
  let fixture: ComponentFixture<SufferingFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SufferingFromComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SufferingFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

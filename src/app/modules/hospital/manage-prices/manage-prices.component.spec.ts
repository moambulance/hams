import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePricesComponent } from './manage-prices.component';

describe('ManagePricesComponent', () => {
  let component: ManagePricesComponent;
  let fixture: ComponentFixture<ManagePricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

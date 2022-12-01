import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotCompaniesComponent } from './iot-companies.component';

describe('IotCompaniesComponent', () => {
  let component: IotCompaniesComponent;
  let fixture: ComponentFixture<IotCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IotCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IotCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

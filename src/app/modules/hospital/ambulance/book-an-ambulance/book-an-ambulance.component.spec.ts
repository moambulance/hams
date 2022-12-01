import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAnAmbulanceComponent } from './book-an-ambulance.component';

describe('BookAnAmbulanceComponent', () => {
  let component: BookAnAmbulanceComponent;
  let fixture: ComponentFixture<BookAnAmbulanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAnAmbulanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAnAmbulanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

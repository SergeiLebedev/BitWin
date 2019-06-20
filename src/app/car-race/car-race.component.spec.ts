import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRaceComponent } from './car-race.component';

describe('CarRaceComponent', () => {
  let component: CarRaceComponent;
  let fixture: ComponentFixture<CarRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

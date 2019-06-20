import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceProbabilityComponent } from './price-probability.component';

describe('PriceProbabilityComponent', () => {
  let component: PriceProbabilityComponent;
  let fixture: ComponentFixture<PriceProbabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceProbabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceProbabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveranceSpeedComponent } from './deliverance-speed.component';

describe('DeliveranceSpeedComponent', () => {
  let component: DeliveranceSpeedComponent;
  let fixture: ComponentFixture<DeliveranceSpeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveranceSpeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveranceSpeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

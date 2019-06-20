import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadCodeComponent } from './road-code.component';

describe('RoadCodeComponent', () => {
  let component: RoadCodeComponent;
  let fixture: ComponentFixture<RoadCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

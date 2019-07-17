import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FernComponent } from './fern.component';

describe('FernComponent', () => {
  let component: FernComponent;
  let fixture: ComponentFixture<FernComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FernComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

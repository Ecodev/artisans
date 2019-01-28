import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBookableComponent } from './select-bookable.component';

describe('SelectBookableComponent', () => {
  let component: SelectBookableComponent;
  let fixture: ComponentFixture<SelectBookableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBookableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBookableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

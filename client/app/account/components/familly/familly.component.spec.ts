import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamillyComponent } from './familly.component';

describe('FamillyComponent', () => {
  let component: FamillyComponent;
  let fixture: ComponentFixture<FamillyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamillyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamillyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

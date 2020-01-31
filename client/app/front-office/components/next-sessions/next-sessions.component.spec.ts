import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSessionsComponent } from './next-sessions.component';

describe('NextSessionsComponent', () => {
  let component: NextSessionsComponent;
  let fixture: ComponentFixture<NextSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

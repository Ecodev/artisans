import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningNavigationsComponent } from './navigations.component';

describe('RunningNavigationsComponent', () => {
  let component: RunningNavigationsComponent;
  let fixture: ComponentFixture<RunningNavigationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningNavigationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningNavigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

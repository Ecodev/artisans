import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamillyMemberComponent } from './familly-member.component';

describe('FamillyMemberComponent', () => {
  let component: FamillyMemberComponent;
  let fixture: ComponentFixture<FamillyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamillyMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamillyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

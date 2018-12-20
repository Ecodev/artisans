import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWrapperComponent } from './account-wrapper.component';

describe('AccountWrapperComponent', () => {
  let component: AccountWrapperComponent;
  let fixture: ComponentFixture<AccountWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

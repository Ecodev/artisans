import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpenseClaimComponent } from './create-expense-claim.component';

describe('CreateExpenseClaimComponent', () => {
  let component: CreateExpenseClaimComponent;
  let fixture: ComponentFixture<CreateExpenseClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExpenseClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpenseClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

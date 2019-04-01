import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingDocumentsComponent } from './accounting-documents.component';

describe('AccountingDocumentsComponent', () => {
  let component: AccountingDocumentsComponent;
  let fixture: ComponentFixture<AccountingDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

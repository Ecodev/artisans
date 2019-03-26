import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableTransactionLinesComponent } from './editable-transaction-lines.component';

describe('EditableTransactionLinesComponent', () => {
  let component: EditableTransactionLinesComponent;
  let fixture: ComponentFixture<EditableTransactionLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableTransactionLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableTransactionLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

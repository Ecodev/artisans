import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SessionSideColumnComponent} from './session-side-column.component';

describe('SessionSideColumnComponent', () => {
    let component: SessionSideColumnComponent;
    let fixture: ComponentFixture<SessionSideColumnComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SessionSideColumnComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SessionSideColumnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

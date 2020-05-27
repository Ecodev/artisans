import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SessionMethodComponent} from './session-method.component';

describe('SessionMethodComponent', () => {
    let component: SessionMethodComponent;
    let fixture: ComponentFixture<SessionMethodComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SessionMethodComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SessionMethodComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

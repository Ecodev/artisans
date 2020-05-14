import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFacilitatorComponent } from './session-facilitator.component';

describe('SessionFacilitatorComponent', () => {
    let component: SessionFacilitatorComponent;
    let fixture: ComponentFixture<SessionFacilitatorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SessionFacilitatorComponent],
        })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SessionFacilitatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SessionOrganisationComponent} from './session-organisation.component';

describe('SessionOrganisationComponent', () => {
    let component: SessionOrganisationComponent;
    let fixture: ComponentFixture<SessionOrganisationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SessionOrganisationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SessionOrganisationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

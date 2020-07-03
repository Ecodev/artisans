import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BnsComponent} from './bns.component';

describe('BnsComponent', () => {
    let component: BnsComponent;
    let fixture: ComponentFixture<BnsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BnsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BnsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

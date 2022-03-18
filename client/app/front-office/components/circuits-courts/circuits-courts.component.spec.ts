import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CircuitsCourtsComponent} from './circuits-courts.component';

describe('CircuitsCourtsComponent', () => {
    let component: CircuitsCourtsComponent;
    let fixture: ComponentFixture<CircuitsCourtsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CircuitsCourtsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CircuitsCourtsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

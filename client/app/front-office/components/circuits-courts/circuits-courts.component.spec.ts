import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CircuitsCourtsComponent} from './circuits-courts.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('CircuitsCourtsComponent', () => {
    let component: CircuitsCourtsComponent;
    let fixture: ComponentFixture<CircuitsCourtsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CircuitsCourtsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

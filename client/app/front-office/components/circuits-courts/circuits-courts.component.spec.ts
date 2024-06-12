import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CircuitsCourtsComponent} from './circuits-courts.component';
import {provideRouter} from '@angular/router';

describe('CircuitsCourtsComponent', () => {
    let component: CircuitsCourtsComponent;
    let fixture: ComponentFixture<CircuitsCourtsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(CircuitsCourtsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

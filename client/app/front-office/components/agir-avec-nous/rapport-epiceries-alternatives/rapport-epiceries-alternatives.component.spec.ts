import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RapportEpiceriesAlternativesComponent} from './rapport-epiceries-alternatives.component';

describe('RapportEpiceriesAlternativesComponent', () => {
    let component: RapportEpiceriesAlternativesComponent;
    let fixture: ComponentFixture<RapportEpiceriesAlternativesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RapportEpiceriesAlternativesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RapportEpiceriesAlternativesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

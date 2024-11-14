import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IrremplacablesEpiceriesComponent} from './irremplacables-epiceries.component';

describe('IrremplacablesEpiceriesComponent', () => {
    let component: IrremplacablesEpiceriesComponent;
    let fixture: ComponentFixture<IrremplacablesEpiceriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IrremplacablesEpiceriesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(IrremplacablesEpiceriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BnsComponent} from './bns.component';
import {provideRouter} from '@angular/router';

describe('BnsComponent', () => {
    let component: BnsComponent;
    let fixture: ComponentFixture<BnsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(BnsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

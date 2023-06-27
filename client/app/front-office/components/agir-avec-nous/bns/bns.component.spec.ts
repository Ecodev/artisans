import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BnsComponent} from './bns.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('BnsComponent', () => {
    let component: BnsComponent;
    let fixture: ComponentFixture<BnsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(BnsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

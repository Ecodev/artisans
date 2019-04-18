import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NaturalFixedButtonComponent } from './fixed-button.component';
import { MatButtonModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { NaturalModule } from '../../natural.module';

describe('FixedButtonComponent', () => {
    let component: NaturalFixedButtonComponent;
    let fixture: ComponentFixture<NaturalFixedButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                RouterTestingModule,
                MatButtonModule,
                HttpClientModule,
                NaturalModule.forRoot({}),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NaturalFixedButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FixedButtonComponent } from './fixed-button.component';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { IconComponent } from '../icon/icon.component';

describe('FixedButtonComponent', () => {
    let component: FixedButtonComponent;
    let fixture: ComponentFixture<FixedButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FixedButtonComponent,
                IconComponent,
            ],
            imports: [
                RouterTestingModule,
                MatButtonModule,
                MatIconModule,
                HttpClientModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FixedButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

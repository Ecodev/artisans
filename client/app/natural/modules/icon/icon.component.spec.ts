import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NaturalIconComponent } from './icon.component';
import { MatIconModule } from '@angular/material';
import { NaturalModule } from '../../natural.module';

describe('NaturalIconComponent', () => {
    let component: NaturalIconComponent;
    let fixture: ComponentFixture<NaturalIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],
            imports: [
                RouterTestingModule,
                MatIconModule,
                NaturalModule.forRoot({})
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NaturalIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

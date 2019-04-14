import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IconComponent } from './icon.component';
import { MatIconModule } from '@angular/material';

describe('IconComponent', () => {
    let component: IconComponent;
    let fixture: ComponentFixture<IconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IconComponent],
            imports: [
                RouterTestingModule,
                MatIconModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEnumComponent } from './select-enum.component';
import { MaterialModule } from '../../modules/material.module';
import { IchtusModule } from '../../modules/ichtus.module';
import { MockApolloProvider } from '../../testing/MockApolloProvider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectEnumComponent', () => {
    let component: SelectEnumComponent;
    let fixture: ComponentFixture<SelectEnumComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [], // SelectEnumComponent is exported by IchtusModule
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                IchtusModule,
            ],
            providers: [
                MockApolloProvider,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectEnumComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

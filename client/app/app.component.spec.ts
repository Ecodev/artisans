import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApolloModule } from 'apollo-angular';
import { NgProgressModule } from '@ngx-progressbar/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockApolloProvider } from './shared/testing/MockApolloProvider';
import { AppMaterialModule } from './app-material/app-material.module';
import { RelationsComponent } from './shared/components/relations/relations.component';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from './shared/components/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './shared/components/select/select.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
    DateAdapter,
    ErrorStateMatcher,
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatIconRegistry,
    ShowOnDirtyErrorStateMatcher,
} from '@angular/material';
import { TimezonePreservingDateAdapter } from './shared/services/timezone.preserving.date.adapter';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                RelationsComponent,
                SelectComponent,
            ],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
                NgProgressModule.forRoot(),
                ApolloModule,
                AppRoutingModule,
                FlexLayoutModule,
                AppMaterialModule,
                IconModule,
            ],
            providers: [
                MockApolloProvider,
                MatIconRegistry,
                {
                    provide: DateAdapter,
                    useClass: TimezonePreservingDateAdapter,
                },
                {
                    // Use OnDirty instead of default OnTouched, that allows to validate while editing. Touched is updated after blur.
                    provide: ErrorStateMatcher,
                    useClass: ShowOnDirtyErrorStateMatcher,
                },
                {
                    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
                    useValue: {
                        appearance: 'fill',
                    },
                },
                {
                    provide: APP_BASE_HREF,
                    useValue: '/',
                },
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'my-ichtus'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('my-ichtus');
    });

    it('should render title in a h1 tag', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Welcome to my-ichtus!');
    });
});

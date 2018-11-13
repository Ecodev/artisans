import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ApolloModule } from 'apollo-angular';
import { NgProgressModule } from '@ngx-progressbar/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockApolloProvider } from './shared/testing/MockApolloProvider';
import { AppMaterialModule } from './app-material/app-material.module';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                NgProgressModule.forRoot(),
                ApolloModule,
                BrowserModule,
                BrowserAnimationsModule,
                AppMaterialModule,
            ],
            declarations: [
                AppComponent,
            ],
            providers: [
                MockApolloProvider,
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

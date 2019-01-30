import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    DateAdapter,
    ErrorStateMatcher,
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatIconRegistry,
    ShowOnDirtyErrorStateMatcher,
} from '@angular/material';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { AlertService } from './shared/components/alert/alert.service';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { apolloDefaultOptions, createApolloLink } from './shared/config/apolloDefaultOptions';
import { TimezonePreservingDateAdapter } from './shared/services/timezone.preserving.date.adapter';
import { IconModule } from './shared/components/icon/icon.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './shared/components/error/error.component';
import { MaterialModule } from './shared/modules/material.module';
import { IchtusModule } from './shared/modules/ichtus.module';
import { HttpBatchLink, HttpBatchLinkModule } from 'apollo-angular-link-http-batch';
import { NetworkInterceptorService } from './shared/services/network-interceptor.service';
import localeFRCH from '@angular/common/locales/fr-CH';
import { registerLocaleData } from '@angular/common';
import { HierarchicSelectorModule } from './shared/hierarchic-selector/hierarchic-selector.module';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

registerLocaleData(localeFRCH);

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        DashboardComponent,
        BootLoaderComponent,
        ErrorComponent,
        RequestPasswordResetComponent,
        ChangePasswordComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgProgressModule.forRoot(),
        ApolloModule,
        AppRoutingModule,
        MaterialModule,
        IchtusModule,
        IconModule,
        HttpClientModule,
        HttpBatchLinkModule,
        HierarchicSelectorModule,
    ],
    providers: [
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
            provide: HTTP_INTERCEPTORS,
            useClass: NetworkInterceptorService,
            multi: true,
        },
        {provide: LOCALE_ID, useValue: 'fr-CH'},
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(apollo: Apollo,
                networkActivityService: NetworkActivityService,
                alertService: AlertService,
                httpBatchLink: HttpBatchLink,
                dateAdapter: DateAdapter<Date>) {
        dateAdapter.setLocale('fr-ch');

        const link = createApolloLink(networkActivityService, alertService, httpBatchLink);

        apollo.create({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
        });
    }
}

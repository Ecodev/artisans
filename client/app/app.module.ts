import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeFRCH from '@angular/common/locales/fr-CH';
import { LOCALE_ID, NgModule } from '@angular/core';

import {
    DateAdapter,
    ErrorStateMatcher,
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatIconRegistry,
    ShowOnDirtyErrorStateMatcher,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NaturalAlertService } from '@ecodev/natural';
import { NgProgressModule } from '@ngx-progressbar/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpBatchLink, HttpBatchLinkModule } from 'apollo-angular-link-http-batch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { strings as frenchStrings } from 'ngx-timeago/language-strings/fr-short';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontEndComponent } from './front-end/front-end.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { ModalTriggerComponent } from './shared/components/modal-trigger/modal-trigger.component';
import { apolloDefaultOptions, createApolloLink } from './shared/config/apolloDefaultOptions';
import { EmmyModule } from './shared/modules/emmy.module';
import { MaterialModule } from './shared/modules/material.module';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { NetworkInterceptorService } from './shared/services/network-interceptor.service';
import { SwissParsingDateAdapter } from './shared/services/swiss-parsing-date-adapter.service';
import { ShopModule } from './shop/shop.module';

registerLocaleData(localeFRCH);

export class MyIntl extends TimeagoIntl {
    // do extra stuff here...
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        FrontEndComponent,
        BootLoaderComponent,
        ErrorComponent,
        ModalTriggerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        EmmyModule,
        NgProgressModule,
        ApolloModule,
        AppRoutingModule,
        ShopModule,
        HttpClientModule,
        HttpBatchLinkModule,
        TimeagoModule.forRoot({
            intl: {provide: TimeagoIntl, useClass: MyIntl},
            formatter: {provide: TimeagoFormatter, useClass: TimeagoCustomFormatter},
        }),
    ],
    providers: [
        MatIconRegistry,
        {
            provide: DateAdapter,
            useClass: SwissParsingDateAdapter,
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
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(apollo: Apollo,
                networkActivityService: NetworkActivityService,
                alertService: NaturalAlertService,
                httpBatchLink: HttpBatchLink,
                dateAdapter: DateAdapter<Date>,
                intl: TimeagoIntl,
    ) {
        dateAdapter.setLocale('fr-ch');

        intl.strings = frenchStrings;
        intl.changes.next();

        const link = createApolloLink(networkActivityService, alertService, httpBatchLink);

        apollo.create({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
        });
    }
}

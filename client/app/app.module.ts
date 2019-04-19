import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
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
import { NetworkActivityService } from './shared/services/network-activity.service';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { apolloDefaultOptions, createApolloLink } from './shared/config/apolloDefaultOptions';
import { SwissParsingDateAdapter } from './shared/services/swiss-parsing-date-adapter.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DoorComponent } from './door/door.component';
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
import { SafetyComponent } from './safety/safety.component';
import { NgProgressModule } from '@ngx-progressbar/core';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { strings as frenchStrings } from 'ngx-timeago/language-strings/fr-short';
import { NaturalModule } from './natural/natural.module';
import { NaturalAlertService } from './natural/modules/alert/alert.service';
import { NaturalIconsConfig } from './natural/modules/icon/icon.component';

registerLocaleData(localeFRCH);

export class MyIntl extends TimeagoIntl {
    // do extra stuff here...
}

const iconsConfig: NaturalIconsConfig = {
    'qr': {
        svg: 'assets/icons/qr.svg',
    },
    'simple-qr': {
        svg: 'assets/icons/simple-qr.svg',
    },
    'own_bookable': {
        svg: 'assets/icons/swimsuit.svg',
    },
    'code': {
        svg: 'assets/icons/input.svg',
    },
    'doors': {
        svg: 'assets/icons/key.svg',
    },
    'family': {
        svg: 'assets/icons/family.svg',
    },
    'lake': {
        svg: 'assets/icons/lake.svg',
    },
    'transactionHistory': {
        svg: 'assets/icons/history.svg',
    },
    'claims': {
        svg: 'assets/icons/claims.svg',
    },
    'finances': {
        svg: 'assets/icons/notes.svg',
    },
    'browse_bookables': {
        svg: 'assets/icons/search.svg',
    },
    'administrator': {
        svg: 'assets/icons/boss.svg',
    },
    'exit': {
        svg: 'assets/icons/exit.svg',
    },
    'ichtus': {
        svg: 'assets/ichtus.svg',
    },
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        DoorComponent,
        DashboardComponent,
        BootLoaderComponent,
        ErrorComponent,
        SafetyComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgProgressModule,
        ApolloModule,
        AppRoutingModule,
        MaterialModule,
        IchtusModule,
        NaturalModule.forRoot(iconsConfig),
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

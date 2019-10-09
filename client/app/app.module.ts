import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeFRCH from '@angular/common/locales/fr-CH';
import { LOCALE_ID, NgModule } from '@angular/core';

import { DateAdapter, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NaturalAlertService, NaturalSwissParsingDateAdapter } from '@ecodev/natural';
import { NgProgressModule } from '@ngx-progressbar/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpBatchLink, HttpBatchLinkModule } from 'apollo-angular-link-http-batch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontEndComponent } from './front-end/front-end.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { apolloDefaultOptions, createApolloLink } from './shared/config/apolloDefaultOptions';
import { ArtisansModule } from './shared/modules/artisans.module';
import { MaterialModule } from './shared/modules/material.module';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { NetworkInterceptorService } from './shared/services/network-interceptor.service';
import { ShopModule } from './shop/shop.module';

registerLocaleData(localeFRCH);

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        FrontEndComponent,
        BootLoaderComponent,
        ErrorComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        ArtisansModule,
        NgProgressModule,
        ApolloModule,
        AppRoutingModule,
        ShopModule,
        HttpClientModule,
        HttpBatchLinkModule,
    ],
    providers: [
        MatIconRegistry,
        {
            provide: DateAdapter,
            useClass: NaturalSwissParsingDateAdapter,
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
    ) {
        dateAdapter.setLocale('fr-ch');

        const link = createApolloLink(networkActivityService, alertService, httpBatchLink);

        apollo.create({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
        });
    }
}

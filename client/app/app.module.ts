import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeFRCH from '@angular/common/locales/fr-CH';
import { Inject, LOCALE_ID, NgModule, PLATFORM_ID } from '@angular/core';

import { DateAdapter, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NaturalAlertService, NaturalSwissParsingDateAdapter } from '@ecodev/natural';
import { NgProgressModule } from 'ngx-progressbar';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpBatchLink, HttpBatchLinkModule } from 'apollo-angular-link-http-batch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { QuillModule } from 'ngx-quill';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontOfficeModule } from './front-office/front-office.module';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { ErrorComponent } from './shared/components/error/error.component';
import {
    apolloDefaultOptions,
    createApolloLink,
    createApolloLinkForServer,
} from './shared/config/apolloDefaultOptions';
import { quillConfig } from './shared/config/quill.options';
import { ArtisansModule } from './shared/modules/artisans.module';
import { MaterialModule } from './shared/modules/material.module';
import { LocalizedPaginatorIntlService } from './shared/services/localized-paginator-intl.service';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { NetworkInterceptorService } from './shared/services/network-interceptor.service';
import { ssrCompatibleStorageProvider } from './shared/utils';

registerLocaleData(localeFRCH);

@NgModule({
    declarations: [
        AppComponent,
        BootLoaderComponent,
        ErrorComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        ArtisansModule,
        NgProgressModule,
        ApolloModule,
        AppRoutingModule,
        HttpClientModule,
        HttpBatchLinkModule,
        FrontOfficeModule,
        QuillModule.forRoot(quillConfig),
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
        {
            provide: LOCALE_ID,
            useValue: 'fr-CH',
        },
        {
            provide: MatPaginatorIntl,
            useClass: LocalizedPaginatorIntlService,
        },
        ssrCompatibleStorageProvider,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(apollo: Apollo,
                networkActivityService: NetworkActivityService,
                alertService: NaturalAlertService,
                httpBatchLink: HttpBatchLink,
                dateAdapter: DateAdapter<Date>,
                // tslint:disable-next-line:ban-types
                @Inject(PLATFORM_ID) readonly platformId: Object,
    ) {
        // tells if it's browser or server
        const isBrowser = isPlatformBrowser(platformId);

        dateAdapter.setLocale('fr-ch');

        const link = isBrowser ?
            createApolloLink(networkActivityService, alertService, httpBatchLink) :
            createApolloLinkForServer(httpBatchLink);

        apollo.create({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
            ssrMode: !isBrowser,
        });
    }
}

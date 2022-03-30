import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpBatchLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
import {isPlatformBrowser, registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import localeFRCH from '@angular/common/locales/fr-CH';
import {Inject, LOCALE_ID, NgModule, PLATFORM_ID} from '@angular/core';
import {DateAdapter, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatIconRegistry} from '@angular/material/icon';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    NATURAL_SEO_CONFIG,
    NaturalAlertService,
    NaturalSeoConfig,
    NaturalSeoService,
    NaturalSwissParsingDateAdapter,
} from '@ecodev/natural';
import {NgProgressModule} from 'ngx-progressbar';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FrontOfficeModule} from './front-office/front-office.module';
import {BootLoaderComponent} from './shared/components/boot-loader/boot-loader.component';
import {ErrorComponent} from './shared/components/error/error.component';
import {apolloDefaultOptions, createApolloLink, createApolloLinkForServer} from './shared/config/apolloDefaultOptions';
import {ArtisansModule} from './shared/modules/artisans.module';
import {MaterialModule} from './shared/modules/material.module';
import {LocalizedPaginatorIntlService} from './shared/services/localized-paginator-intl.service';
import {NetworkActivityService} from './shared/services/network-activity.service';
import {NetworkInterceptorService} from './shared/services/network-interceptor.service';

registerLocaleData(localeFRCH);

@NgModule({
    declarations: [AppComponent, BootLoaderComponent, ErrorComponent],
    imports: [
        ApolloModule,
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        BrowserModule,
        BrowserAnimationsModule.withConfig({
            // Disable animations if not supported (on iPhone 6 / Safari 13, or SSR)
            disableAnimations:
                // eslint-disable-next-line no-restricted-globals
                typeof document === 'undefined' ||
                // eslint-disable-next-line no-restricted-globals
                !('animate' in document.documentElement) ||
                // eslint-disable-next-line no-restricted-globals
                (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent)),
        }),
        MaterialModule,
        ArtisansModule,
        NgProgressModule,
        AppRoutingModule,
        HttpClientModule,
        FrontOfficeModule,
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
        {
            provide: NATURAL_SEO_CONFIG,
            useValue: {
                applicationName: 'Les artisans de la transition',
                defaultDescription: 'Comprendre l’urgence écologique, Des pistes pour y répondre',
                defaultRobots: 'all, index, follow',
            } as NaturalSeoConfig,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    public constructor(
        apollo: Apollo,
        networkActivityService: NetworkActivityService,
        alertService: NaturalAlertService,
        httpBatchLink: HttpBatchLink,
        dateAdapter: DateAdapter<Date>,
        // eslint-disable-next-line @typescript-eslint/ban-types
        @Inject(PLATFORM_ID) platformId: Object,
        naturalSeoService: NaturalSeoService, // injection required, but works as stand alone
    ) {
        // tells if it's browser or server
        const isBrowser = isPlatformBrowser(platformId);

        dateAdapter.setLocale('fr-ch');

        const link = isBrowser
            ? createApolloLink(networkActivityService, alertService, httpBatchLink)
            : createApolloLinkForServer(httpBatchLink);

        apollo.create({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
            ssrMode: !isBrowser,
        });
    }
}

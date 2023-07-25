import {APP_ID, APP_INITIALIZER, enableProdMode, importProvidersFrom, inject, LOCALE_ID} from '@angular/core';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {routes} from './app/app-routing.module';
import {provideAnimations, provideNoopAnimations} from '@angular/platform-browser/animations';
import {bootstrapApplication} from '@angular/platform-browser';
import {Apollo} from 'apollo-angular';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {apolloOptionsProvider} from './app/shared/config/apolloDefaultOptions';
import {LocalizedPaginatorIntlService} from './app/shared/services/localized-paginator-intl.service';
import {DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData} from '@angular/common';
import {activityInterceptor} from './app/shared/services/activity-interceptor';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorIntl} from '@angular/material/paginator';
import {
    DateAdapter,
    ErrorStateMatcher,
    MatNativeDateModule,
    ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {LoggerExtraService} from './app/shared/services/logger-extra.service';
import {localConfig} from './app/shared/generated-config';
import {
    graphqlQuerySigner,
    naturalProviders,
    NaturalSwissParsingDateAdapter,
    provideErrorHandler,
    provideIcons,
    provideSeo,
} from '@ecodev/natural';
import localeFRCH from '@angular/common/locales/fr-CH';
import {provideRouter, withInMemoryScrolling, withRouterConfig} from '@angular/router';

if (environment.production) {
    enableProdMode();
}

registerLocaleData(localeFRCH);

const matTooltipCustomConfig: MatTooltipDefaultOptions = {
    showDelay: 5,
    hideDelay: 5,
    touchendHideDelay: 5,
    touchGestures: 'off',
};

// Disable animations if not supported (on iPhone 6 / Safari 13, or SSR)
const disableAnimations =
    // eslint-disable-next-line no-restricted-globals
    typeof document === 'undefined' ||
    // eslint-disable-next-line no-restricted-globals
    !('animate' in document.documentElement) ||
    // eslint-disable-next-line no-restricted-globals
    (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent));

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(MatNativeDateModule),
        Apollo,
        disableAnimations ? provideNoopAnimations() : provideAnimations(),
        naturalProviders,
        provideErrorHandler(localConfig.log.url, LoggerExtraService),
        provideSeo({
            applicationName: 'Les artisans de la transition',
            defaultDescription: 'Comprendre l’urgence écologique, Des pistes pour y répondre',
            defaultRobots: 'all, index, follow',
        }),
        provideIcons({}),
        {provide: APP_ID, useValue: 'serverApp'},
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
            // See https://github.com/angular/components/issues/26580
            provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
            useValue: {
                formFieldAppearance: 'fill',
            },
        },
        {
            provide: LOCALE_ID,
            useValue: 'fr-CH',
        },
        {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: {
                timezone: 'fr-CH',
            },
        },
        {
            provide: MatPaginatorIntl,
            useClass: LocalizedPaginatorIntlService,
        },
        apolloOptionsProvider,
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: matTooltipCustomConfig},
        provideHttpClient(withInterceptors([activityInterceptor, graphqlQuerySigner(localConfig.signedQueries.key)])),
        provideRouter(
            routes,
            withRouterConfig({
                paramsInheritanceStrategy: 'always',
            }),
            withInMemoryScrolling({
                scrollPositionRestoration: 'top',
            }),
        ),
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: (): (() => void) => {
                const dateAdapter = inject(DateAdapter);

                return () => dateAdapter.setLocale('fr-ch');
            },
        },
    ],
}).catch(err => console.error(err));

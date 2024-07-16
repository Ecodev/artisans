import {APP_ID, APP_INITIALIZER, enableProdMode, inject, LOCALE_ID} from '@angular/core';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {routes} from './app/app-routing.module';
import {provideAnimations} from '@angular/platform-browser/animations';
import {bootstrapApplication} from '@angular/platform-browser';
import {Apollo} from 'apollo-angular';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {apolloOptionsProvider} from './app/shared/config/apollo-options.provider';
import {LocalizedPaginatorIntlService} from './app/shared/services/localized-paginator-intl.service';
import {DATE_PIPE_DEFAULT_OPTIONS, DatePipeConfig, registerLocaleData} from '@angular/common';
import {activityInterceptor} from './app/shared/services/activity-interceptor';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions, MatPaginatorIntl} from '@angular/material/paginator';
import {
    DateAdapter,
    ErrorStateMatcher,
    provideNativeDateAdapter,
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
import {MAT_TABS_CONFIG, MatTabsConfig} from '@angular/material/tabs';

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

bootstrapApplication(AppComponent, {
    providers: [
        provideNativeDateAdapter(),
        Apollo,
        provideAnimations(),
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
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: {dateFormat: 'dd.MM.y HH:mm'} satisfies DatePipeConfig,
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
            } satisfies MatPaginatorDefaultOptions,
        },
        {
            provide: MAT_TABS_CONFIG,
            useValue: {
                stretchTabs: false,
            } satisfies MatTabsConfig,
        },
        {
            provide: LOCALE_ID,
            useValue: 'fr-CH',
        },
        {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: {
                timezone: 'fr-CH',
            } satisfies Partial<DatePipeConfig>, // See https://github.com/angular/angular/pull/51287
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
}).catch((err: unknown) => {
    console.error(err);
});

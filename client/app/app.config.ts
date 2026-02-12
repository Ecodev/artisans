import {
    APP_ID,
    ApplicationConfig,
    inject,
    LOCALE_ID,
    provideAppInitializer,
    provideZoneChangeDetection,
} from '@angular/core';
import {routes} from './app.routes';
import {Apollo} from 'apollo-angular';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {apolloOptionsProvider} from './shared/config/apollo-options.provider';
import {LocalizedPaginatorIntlService} from './shared/services/localized-paginator-intl.service';
import {DATE_PIPE_DEFAULT_OPTIONS, DatePipeConfig, registerLocaleData} from '@angular/common';
import {
    activityInterceptor,
    graphqlQuerySigner,
    naturalProviders,
    NaturalSwissParsingDateAdapter,
    provideErrorHandler,
    provideIcons,
    provideSeo,
} from '@ecodev/natural';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions, MatPaginatorIntl} from '@angular/material/paginator';
import {
    DateAdapter,
    ErrorStateMatcher,
    provideNativeDateAdapter,
    ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {LoggerExtraService} from './shared/services/logger-extra.service';
import {localConfig, signedQueriesKey} from './shared/generated-config';
import localeFRCH from '@angular/common/locales/fr-CH';
import {provideRouter, withInMemoryScrolling, withRouterConfig} from '@angular/router';
import {MAT_TABS_CONFIG, MatTabsConfig} from '@angular/material/tabs';

registerLocaleData(localeFRCH);

const matTooltipCustomConfig: MatTooltipDefaultOptions = {
    showDelay: 5,
    hideDelay: 5,
    touchendHideDelay: 5,
    touchGestures: 'off',
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideNativeDateAdapter(),
        Apollo,
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
            } satisfies DatePipeConfig,
        },
        {
            provide: MatPaginatorIntl,
            useClass: LocalizedPaginatorIntlService,
        },
        apolloOptionsProvider,
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: matTooltipCustomConfig},
        provideHttpClient(withInterceptors([activityInterceptor, graphqlQuerySigner(signedQueriesKey)])),
        provideRouter(
            routes,
            withRouterConfig({
                paramsInheritanceStrategy: 'always',
            }),
            withInMemoryScrolling({
                scrollPositionRestoration: 'top',
            }),
        ),
        provideAppInitializer(() => {
            const dateAdapter = inject(DateAdapter);
            dateAdapter.setLocale('fr-ch');
        }),
    ],
};

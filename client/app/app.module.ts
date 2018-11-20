import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { apolloDefaultOptions } from './shared/config/apollo.default.options';
import { TimezonePreservingDateAdapter } from './shared/services/timezone.preserving.date.adapter';
import { RelationsComponent } from './shared/components/relations/relations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material/app-material.module';
import { IconModule } from './shared/components/icon/icon.module';
import { SelectComponent } from './shared/components/select/select.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        RelationsComponent,
        SelectComponent,
        LoginComponent,
        HomeComponent,
        DashboardComponent,
        BootLoaderComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgProgressModule.forRoot(),
        ApolloModule,
        AppRoutingModule,
        AppMaterialModule,
        IconModule,
        HttpClientModule
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
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(apollo: Apollo,
                networkActivitySvc: NetworkActivityService,
                alertSvc: AlertService,
                private dateAdapter: DateAdapter<Date>) {
        dateAdapter.setLocale('fr-ch');

        const link = createUploadLink({
            uri: '/graphql',
            credentials: 'include',
        });

        const middleware = new ApolloLink((operation, forward) => {
            networkActivitySvc.increase();

            if (forward) {
                return forward(operation).map(response => {
                    networkActivitySvc.decrease();
                    return response;
                });
            }

            return null;
        });

        const errorLink = onError(({graphQLErrors, networkError}) => {

            // Network errors seems not to be catched by above middleware, and we need to be informed to decrease pending queries
            if (networkError) {
                alertSvc.error('Une erreur est survenue sur le réseau');
                networkActivitySvc.decrease();
            }

            // Graphql responses with errors are valid responses and are catched by the above middleware.
            // There seems to be no need to do something here
            // Seems we have no need to deal
            if (graphQLErrors) {
                alertSvc.error('Une erreur est survenue du côté du serveur');
                networkActivitySvc.updateErrors(graphQLErrors);
            }
        });

        apollo.create({
            link: middleware.concat(errorLink).concat(link),
            cache: new InMemoryCache(),
            defaultOptions: apolloDefaultOptions,
        });
    }
}

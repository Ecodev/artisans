import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateAdapter, MatButtonModule, MatCheckboxModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { AlertService } from './shared/components/alert/alert.service';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { apolloDefaultOptions } from './shared/config/apollo.default.options';
import { TimezonePreservingDateAdapter } from './shared/services/timezone.preserving.date.adapter';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        NgProgressModule.forRoot(),
        ApolloModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: TimezonePreservingDateAdapter,
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

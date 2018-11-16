import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { HttpClientModule } from '@angular/common/http';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { UserService } from '../app/user/services/user.service';
import gql from 'graphql-tag';
import { ItemService } from '../app/item/services/item.service';
import { BookingService } from '../app/booking/services/booking.service';
import { QueryVariablesManager } from '../app/shared/classes/query-variables-manager';
import { LinkMutationService } from '../app/shared/services/link-mutation.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
    ],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink) => {
                return {
                    cache: new InMemoryCache(),
                    link: httpLink.create({
                        uri: 'https://my.ichtus.ch/graphql',
                        withCredentials: true,
                    }),
                    defaultOptions: {
                        query: {fetchPolicy: 'network-only'},
                        watchQuery: {fetchPolicy: 'network-only'},
                    },
                };
            },
            deps: [HttpLink],
        },
    ],
})
export class VanillaModule implements DoBootstrap {

    constructor(apollo: Apollo,
                userService: UserService,
                itemService: ItemService,
                bookingService: BookingService,
                linkMutation: LinkMutationService
    ) {

        const api = {
            gql,
            apollo,
            userService,
            itemService,
            bookingService,
            QueryVariablesManager,
            linkMutation
        };

        window['ichtusApi'] = api;
    }

    ngDoBootstrap(appRef: ApplicationRef): void {
        // Nothing to do at all here
    }
}

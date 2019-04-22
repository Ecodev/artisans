import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import gql from 'graphql-tag';
import { BookableService } from '../app/admin/bookables/services/bookable.service';
import { VanillaRoutingModule } from './vanilla-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { UserService } from '../app/admin/users/services/user.service';
import { BookingService } from '../app/admin/bookings/services/booking.service';
import { NaturalLinkMutationService } from '@ecodev/natural';
import { NaturalQueryVariablesManager } from '@ecodev/natural';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        VanillaRoutingModule,
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink) => {
                return {
                    cache: new InMemoryCache(),
                    link: httpLink.create({
                        uri: 'https://emmy.club/graphql',
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
                bookableService: BookableService,
                bookingService: BookingService,
                linkMutation: NaturalLinkMutationService<any>,
    ) {

        const QueryVariablesManager = NaturalQueryVariablesManager; // for retro compatibility

        const api = {
            gql,
            apollo,
            userService,
            bookableService,
            bookingService,
            QueryVariablesManager,
            linkMutation,
        };

        window['emmyApi'] = api;
    }

    ngDoBootstrap(appRef: ApplicationRef): void {
        // Nothing to do at all here
    }
}

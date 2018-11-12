import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { HttpClientModule } from '@angular/common/http';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { UserService } from '../app/user/services/user.service';
import gql from 'graphql-tag';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
    ],
    providers: [{
        provide: APOLLO_OPTIONS,
        useFactory: (httpLink: HttpLink) => {
            return {
                cache: new InMemoryCache(),
                link: httpLink.create({
                    uri: 'https://my.ichtus.ch/graphql',
                    withCredentials: true,
                }),
            };
        },
        deps: [HttpLink],
    }],
})
export class VanillaModule implements DoBootstrap {

    constructor(apollo: Apollo,
                userService: UserService,
    ) {
        const api = {
            gql,
            apollo,
            userService,
        };
        window['ichtusApi'] = api;
    }

    ngDoBootstrap(appRef: ApplicationRef): void {
        // Nothing to do at all here
    }
}

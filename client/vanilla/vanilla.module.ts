import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import gql from 'graphql-tag';
import { HttpClientModule } from '@angular/common/http';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';

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
                    uri: '/graphql',
                }),
            };
        },
        deps: [HttpLink],
    }],
})
export class VanillaModule implements DoBootstrap {

    constructor(apollo: Apollo) {
        console.log('CHOCOLAT');
        window['apollo'] = apollo;
        const query = gql`
            query Countries {
                countries {
                    items {
                        code
                        name
                    }
                }
            }
        `;

        window['query'] = query;
    }

    ngDoBootstrap(appRef: ApplicationRef) {
        console.log('empty bootstrap');
    }
}

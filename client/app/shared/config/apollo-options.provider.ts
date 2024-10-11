import {HttpBatchLink, HttpLink} from 'apollo-angular/http';
import {
    ApolloClientOptions,
    ApolloLink,
    DefaultOptions,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client/core';
import {onError} from '@apollo/client/link/error';
import {createHttpLink, NaturalAlertService} from '@ecodev/natural';
import {NetworkActivityService} from '../services/network-activity.service';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {inject, PLATFORM_ID, Provider} from '@angular/core';
import {localConfig} from '../generated-config';

export const apolloDefaultOptions: DefaultOptions = {
    query: {
        fetchPolicy: 'network-only',
    },
    watchQuery: {
        fetchPolicy: 'cache-and-network',
    },
};

/**
 * Create an Apollo link to show alert in case of error, and message if network is down
 */
function createErrorLink(
    networkActivityService: NetworkActivityService,
    alertService: NaturalAlertService,
): ApolloLink {
    return onError(errorResponse => {
        // Network errors are not caught by uploadInterceptor, so we need to decrease pending queries
        if (errorResponse.networkError) {
            alertService.error('Une erreur est survenue sur le réseau');
            networkActivityService.decrease();
        }

        // Show Graphql responses with errors to end-users (but do not decrease pending queries because it is done by uploadInterceptor)
        if (errorResponse.graphQLErrors) {
            errorResponse.graphQLErrors.forEach(error => {
                if ('extensions' in error && error.extensions.showSnack) {
                    // Show whatever server prepared for end-user, with a bit more time to read
                    alertService.error(error.message, 5000);
                } else {
                    // Use a generic message for internal error not to frighten end-user too much
                    alertService.error('Une erreur est survenue du côté du serveur');
                }
            });

            networkActivityService.updateErrors(errorResponse.graphQLErrors);
        }
    });
}

function createApolloLink(
    networkActivityService: NetworkActivityService,
    alertService: NaturalAlertService,
    httpLink: HttpLink,
    httpBatchLink: HttpBatchLink,
): ApolloLink {
    const errorLink = createErrorLink(networkActivityService, alertService);

    return errorLink.concat(
        createHttpLink(httpLink, httpBatchLink, {
            uri: '/graphql?v=' + localConfig.version,
        }),
    );
}

function apolloOptionsFactory(): ApolloClientOptions<NormalizedCacheObject> {
    const networkActivityService = inject(NetworkActivityService);
    const alertService = inject(NaturalAlertService);
    const httpLink = inject(HttpLink);
    const httpBatchLink = inject(HttpBatchLink);

    const link = createApolloLink(networkActivityService, alertService, httpLink, httpBatchLink);
    return {
        link: link,
        cache: new InMemoryCache(),
        defaultOptions: apolloDefaultOptions,
    };
}

export const apolloOptionsProvider: Provider = {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
    deps: [NetworkActivityService, NaturalAlertService, HttpBatchLink, PLATFORM_ID],
};

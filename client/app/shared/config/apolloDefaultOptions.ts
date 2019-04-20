import { DefaultOptions } from 'apollo-client/ApolloClient';
import { NetworkActivityService } from '../services/network-activity.service';
import { HttpBatchLink } from 'apollo-angular-link-http-batch';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { NaturalAlertService } from '@ecodev/natural';
import { hasFilesAndProcessDate } from '@ecodev/natural';

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
function createErrorLink(networkActivityService: NetworkActivityService,
                         alertService: NaturalAlertService): ApolloLink {
    return onError(({graphQLErrors, networkError}) => {

        // Network errors seems not to be caught by above middleware, and we need to be informed to decrease pending queries
        if (networkError) {
            alertService.error('Une erreur est survenue sur le réseau');
            networkActivityService.decrease();
        }

        // Graphql responses with errors are valid responses and are caught by the above middleware.
        // There seems to be no need to do something here
        if (graphQLErrors) {
            graphQLErrors.forEach((error: any) => {
                alertService.error('Une erreur est survenue du côté du serveur');
            });
            networkActivityService.updateErrors(graphQLErrors);
        }
    });
}

/**
 * Create an Apollo link that support batch, file upload, and network activity
 */
export function createApolloLink(networkActivityService: NetworkActivityService,
                                 alertService: NaturalAlertService,
                                 httpBatchLink: HttpBatchLink): ApolloLink {
    const options = {
        uri: '/graphql',
        credentials: 'include',
    };

    const uploadInterceptor = new ApolloLink((operation, forward) => {
        networkActivityService.increase();

        if (forward) {
            return forward(operation).map(response => {
                networkActivityService.decrease();
                return response;
            });
        } else {
            return null;
        }
    });

    // If query has no file, batch it, otherwise upload only that query
    const httpLink = ApolloLink.split(
        ({variables}) => hasFilesAndProcessDate(variables),
        uploadInterceptor.concat(createUploadLink(options)),
        httpBatchLink.create(options),
    );

    const errorLink = createErrorLink(networkActivityService, alertService);

    return errorLink.concat(httpLink);
}

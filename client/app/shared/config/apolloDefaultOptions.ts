import { hasFilesAndProcessDate, NaturalAlertService } from '@ecodev/natural';
import { HttpBatchLink } from 'apollo-angular-link-http-batch';
import { DefaultOptions } from 'apollo-client/ApolloClient';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { NetworkActivityService } from '../services/network-activity.service';

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
    return onError(errorResponse => {

        // Network errors are not caught by uploadInterceptor, so we need to decrease pending queries
        if (errorResponse.networkError) {
            alertService.error('Une erreur est survenue sur le réseau');
            networkActivityService.decrease();
        }

        // Show Graphql responses with errors to end-users (but do not decrease pending queries because it is done by uploadInterceptor)
        if (errorResponse.graphQLErrors) {
            errorResponse.graphQLErrors.forEach(error => {
                // Use generic message for internal error not to frighten end-user too much
                if (error.extensions && error.extensions.category === 'internal') {
                    alertService.error('Une erreur est survenue du côté du serveur');
                } else {
                    // Show whatever server prepared for end-user, with a little bit more time to read
                    alertService.error(error.message, 5000);
                }
            });

            networkActivityService.updateErrors(errorResponse.graphQLErrors);
        }
    });
}

/**
 * Create a simple Apollo link for server side rendering without network activity, nor upload, nor error alerts
 *
 * This function will only be executed in Node environment, so we can access `process`
 */
export function createApolloLinkForServer(
    httpBatchLink: HttpBatchLink,
): ApolloLink {

    const hostname = process.cwd().split('/').pop() || 'dev.larevuedurable.com';
    const options = {
        uri: 'https://' + hostname + '/graphql', // Must be absolute URL
        credentials: 'include',
    };

    // We must allow to connect to self-signed certificate for development environment
    // Unfortunately, this is only possible to do it globally for the entire process, instead of specifically to our API endpoint
    // See https://github.com/apollographql/apollo-angular/issues/1354#issue-503860648
    if (hostname.match(/\.lan$/)) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    return httpBatchLink.create(options);
}

export function createApolloLink(
    networkActivityService: NetworkActivityService,
    alertService: NaturalAlertService,
    httpBatchLink: HttpBatchLink,
): ApolloLink {
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

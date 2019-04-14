import { DefaultOptions } from 'apollo-client/ApolloClient';
import { NetworkActivityService } from '../services/network-activity.service';
import { HttpBatchLink } from 'apollo-angular-link-http-batch';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { isObject } from 'lodash';
import { Literal } from '../../natural/types/types';
import { AlertService } from '../../natural/components/../../natural/components/alert/alert.service';

export const apolloDefaultOptions: DefaultOptions = {
    query: {
        fetchPolicy: 'network-only',
    },
    watchQuery: {
        fetchPolicy: 'cache-and-network',
    },
};

/**
 * Detect if the query has file to be uploaded or not
 */
function hasFiles(node: Literal): boolean {
    if (!isObject(node)) {
        return false;
    }

    return Object.keys(node).some((key) => {
        const value = node[key];

        return (typeof File !== 'undefined' && value instanceof File) ||
               (typeof Blob !== 'undefined' && value instanceof Blob) ||
               (typeof FileList !== 'undefined' && node[key] instanceof FileList) ||
               hasFiles(value);
    });
}

/**
 * Create an Apollo link to show alert in case of error, and message if network is down
 */
function createErrorLink(networkActivityService: NetworkActivityService,
                         alertService: AlertService): ApolloLink {
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
                                 alertService: AlertService,
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
        ({variables}) => hasFiles(variables),
        uploadInterceptor.concat(createUploadLink(options)),
        httpBatchLink.create(options),
    );

    const errorLink = createErrorLink(networkActivityService, alertService);

    return errorLink.concat(httpLink);
}

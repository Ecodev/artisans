import { DefaultOptions } from 'apollo-client/ApolloClient';

export const apolloDefaultOptions: DefaultOptions = {
    query: {
        fetchPolicy: 'cache-first',
    },
    watchQuery: {
        fetchPolicy: 'cache-and-network',
    },
};

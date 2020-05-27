import gql from 'graphql-tag';
import {permissionsFragment, userMetaFragment} from '../../../../../shared/queries/fragments';

export const subscriptionMetaFragment = gql`
    fragment subscriptionMeta on Subscription {
        id
        name
        description
        isActive
        type
        pricePerUnitCHF
        pricePerUnitEUR
        code
        internalRemarks
        image {
            id
        }
        creationDate
        creator {
            ...userMeta
        }
        updateDate
        updater {
            ...userMeta
        }
    }
    ${userMetaFragment}
`;

export const subscriptionsQuery = gql`
    query Subscriptions($filter: SubscriptionFilter, $sorting: [SubscriptionSorting!], $pagination: PaginationInput) {
        subscriptions(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...subscriptionMeta
            }
            pageSize
            pageIndex
            length
        }
    }
    ${subscriptionMetaFragment}
`;

export const subscriptionQuery = gql`
    query Subscription($id: SubscriptionID!) {
        subscription(id: $id) {
            ...subscriptionMeta
            permissions {
                ...permissions
            }
        }
    }
    ${subscriptionMetaFragment}
    ${permissionsFragment}
`;

export const createSubscription = gql`
    mutation CreateSubscription($input: SubscriptionInput!) {
        createSubscription(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateSubscription = gql`
    mutation UpdateSubscription($id: SubscriptionID!, $input: SubscriptionPartialInput!) {
        updateSubscription(id: $id, input: $input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteSubscriptions = gql`
    mutation DeleteSubscriptions($ids: [SubscriptionID!]!) {
        deleteSubscriptions(ids: $ids)
    }
`;

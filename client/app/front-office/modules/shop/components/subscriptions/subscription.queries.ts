import {gql} from '@apollo/client/core';
import {permissionsFragment, userMetaFragment} from '../../../../../shared/queries/fragments';

export const subscriptionMetaFragment = gql`
    fragment SubscriptionMeta on Subscription {
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
            ...UserMeta
        }
        updateDate
        updater {
            ...UserMeta
        }
    }
    ${userMetaFragment}
`;

export const subscriptionsQuery = gql`
    query SubscriptionsQuery(
        $filter: SubscriptionFilter
        $sorting: [SubscriptionSorting!]
        $pagination: PaginationInput
    ) {
        subscriptions(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...SubscriptionMeta
            }
            pageSize
            pageIndex
            length
        }
    }
    ${subscriptionMetaFragment}
`;

export const subscriptionQuery = gql`
    query SubscriptionQuery($id: SubscriptionID!) {
        subscription(id: $id) {
            ...SubscriptionMeta
            permissions {
                ...PermissionsRUD
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
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateSubscription = gql`
    mutation UpdateSubscription($id: SubscriptionID!, $input: SubscriptionPartialInput!) {
        updateSubscription(id: $id, input: $input) {
            id
            name
            updateDate
            updater {
                ...UserMeta
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

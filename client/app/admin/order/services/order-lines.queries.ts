import {gql} from '@apollo/client/core';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const orderLineMetaFragment = gql`
    fragment OrderLineMeta on OrderLine {
        id
        name
        order {
            id
            balanceCHF
            balanceEUR
        }
        balanceCHF
        balanceEUR
        type
        product {
            id
            name
            code
        }
        subscription {
            id
            name
            code
        }
        quantity
        creationDate
    }
`;

export const orderLinesQuery = gql`
    query OrderLines($filter: OrderLineFilter, $sorting: [OrderLineSorting!], $pagination: PaginationInput) {
        orderLines(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...OrderLineMeta
                permissions {
                    ...PermissionsRUD
                }
                owner {
                    ...UserMeta
                }
            }
            pageSize
            pageIndex
            length
            totalBalanceCHF
            totalBalanceEUR
            totalQuantity
        }
    }
    ${permissionsFragment}
    ${userMetaFragment}
    ${orderLineMetaFragment}
`;

export const orderLineQuery = gql`
    query OrderLine($id: OrderLineID!) {
        orderLine(id: $id) {
            id
            ...OrderLineMeta
            creationDate
            creator {
                ...UserMeta
            }
            updateDate
            updater {
                ...UserMeta
            }
            permissions {
                ...PermissionsRUD
            }
        }
    }
    ${orderLineMetaFragment}
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const updateOrderLine = gql`
    mutation UpdateOrderLine($id: OrderLineID!, $input: OrderLineInput!) {
        updateOrderLine(id: $id, input: $input) {
            ...OrderLineMeta
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
    ${orderLineMetaFragment}
`;

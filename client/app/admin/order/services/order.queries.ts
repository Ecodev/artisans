import gql from 'graphql-tag';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const orderMetaFragment = gql`
    fragment OrderMeta on Order {
        id
        balanceCHF
        balanceEUR
        creationDate
        status
        orderLines {
            id
        }
        owner {
            ...UserMeta
        }
    }
    ${userMetaFragment}
`;

export const ordersQuery = gql`
    query Orders($filter: OrderFilter, $sorting: [OrderSorting!], $pagination: PaginationInput) {
        orders(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...OrderMeta
            }
            pageSize
            pageIndex
            length
            totalBalanceCHF
            totalBalanceEUR
        }
    }
    ${orderMetaFragment}
`;

export const orderQuery = gql`
    query Order($id: OrderID!) {
        order(id: $id) {
            id
            ...OrderMeta
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
    ${orderMetaFragment}
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const createOrder = gql`
    mutation CreateOrder($input: OrderInput!) {
        createOrder(input: $input) {
            id
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateOrderStatus = gql`
    mutation UpdateOrderStatus($id: OrderID!, $status: OrderStatus!) {
        updateOrderStatus(id: $id, status: $status) {
            id
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

import gql from 'graphql-tag';
import { permissionsFragment, userMetaFragment } from '../../shared/queries/fragments';

export const orderMetaFragment = gql`
    fragment orderMeta on Order {
        id
        balanceCHF
        balanceEUR
        creationDate
        orderLines {
            id
        }
        owner {
            id
            name
        }
    }
`;

export const ordersQuery = gql`
    query Orders($filter: OrderFilter, $sorting: [OrderSorting!], $pagination: PaginationInput) {
        orders(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...orderMeta
            }
            pageSize
            pageIndex
            length
            totalBalanceCHF
            totalBalanceEUR
        }
    }
${orderMetaFragment}`;

export const orderQuery = gql`
    query Order($id: OrderID!) {
        order(id: $id) {
            id
            ...orderMeta
            creationDate
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
            permissions {
                ...permissions
            }
        }
    }
    ${orderMetaFragment}
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const createOrder = gql`
    mutation CreateOrder($input: [OrderLineInput!]!) {
        createOrder(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;


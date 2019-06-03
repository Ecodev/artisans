import gql from 'graphql-tag';
import { permissionsFragment, userMetaFragment } from '../../shared/queries/fragments';

export const orderLineMetaFragment = gql`
    fragment orderLineMeta on OrderLine {
        id
        name
        order {
            id
            balance
            vatPart
        }
        vatPart
        vatRate
        balance
        pricePonderation
        product {
            id
            name
            code
            unit
        }
        unit
        quantity
        creationDate
    }
`;

export const orderLinesQuery = gql`
    query OrderLines($filter: OrderLineFilter, $sorting: [OrderLineSorting!], $pagination: PaginationInput) {
        orderLines(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...orderLineMeta
                permissions {
                    ...permissions
                }
            }
            pageSize
            pageIndex
            length
        }
    }
${permissionsFragment}
${orderLineMetaFragment}`;

export const orderLineQuery = gql`
    query OrderLine($id: OrderLineID!) {
        orderLine(id: $id) {
            id
            ...orderLineMeta
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
${orderLineMetaFragment}
${userMetaFragment}
${permissionsFragment}
`;

export const updateOrderLine = gql`
    mutation UpdateOrderLine($id: OrderLineID!, $input:  OrderLineInput!) {
        updateOrderLine(id: $id, input: $input) {
            ...orderLineMeta
            updateDate
            updater {
                ...userMeta
            }
        }
    }
${userMetaFragment}
${orderLineMetaFragment}`;


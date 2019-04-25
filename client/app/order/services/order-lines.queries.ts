import gql from 'graphql-tag';

export const orderLineMetaFragment = gql`
    fragment orderLineMeta on OrderLine {
        id
        order {
            id
        }
        vatPart
        vatRate
        balance
        product {
            id
            name
            code
        }
        unit
        quantity
    }
`;

export const orderLinesQuery = gql`
    query OrderLines($filter: OrderLineFilter, $sorting: [OrderLineSorting!], $pagination: PaginationInput) {
        orderLines(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...orderLineMeta
            }
            pageSize
            pageIndex
            length
        }
    }
${orderLineMetaFragment}`;


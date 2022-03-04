import {gql} from '@apollo/client/core';

export const purchasesQuery = gql`
    query Purchases($filter: ProductFilter, $sorting: [ProductSorting!], $pagination: PaginationInput) {
        purchases(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                type
                product {
                    id
                    name
                    code
                    reviewNumber
                    releaseDate
                    image {
                        id
                        width
                        height
                        mime
                    }
                    file {
                        id
                        mime
                    }
                }
            }
            pageSize
            pageIndex
            length
        }
    }
`;

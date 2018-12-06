import gql from 'graphql-tag';

export const licensesQuery = gql`
    query Licenses($filter: LicenseFilter, $sorting: [LicenseSorting!], $pagination: PaginationInput) {
        licenses(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
            }
            pageSize
            pageIndex
            length
        }
    }
`;

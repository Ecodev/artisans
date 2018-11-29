import gql from 'graphql-tag';

export const tagsQuery = gql`
    query Tags($filter: TagFilter, $sorting: [TagSorting!], $pagination: PaginationInput) {
        tags(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                color
            }
            pageSize
            pageIndex
            length
        }
    }
`;

import gql from 'graphql-tag';

export const tagsQuery = gql`
    query Tags($filter: TagFilter, $pagination: PaginationInput) {
        tags(filter: $filter, pagination: $pagination) {
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

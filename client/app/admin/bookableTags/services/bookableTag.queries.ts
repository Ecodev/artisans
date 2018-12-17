import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const bookableTagsQuery = gql`
    query BookableTags($filter: BookableTagFilter, $sorting: [BookableTagSorting!], $pagination: PaginationInput) {
        bookableTags(filter: $filter, sorting: $sorting, pagination: $pagination) {
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

export const bookableTagQuery = gql`
    query BookableTag($id: BookableTagID!) {
        bookableTag(id: $id) {
            id
            name
            color
            creationDate
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
${userMetaFragment}`;

export const createBookableTagMutation = gql`
    mutation CreateBookableTag($input: BookableTagInput!) {
        createBookableTag(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateBookableTagMutation = gql`
    mutation UpdateBookableTag($id: BookableTagID!, $input: BookableTagPartialInput!) {
        updateBookableTag(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteBookableTagsMutation = gql`
    mutation DeleteBookableTags ($ids: [BookableTagID!]!){
        deleteBookableTags(ids: $ids)
    }`;


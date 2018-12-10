import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const userTagsQuery = gql`
    query UserTags($filter: UserTagFilter, $sorting: [UserTagSorting!], $pagination: PaginationInput) {
        userTags(filter: $filter, sorting: $sorting, pagination: $pagination) {
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

export const userTagQuery = gql`
    query UserTag($id: UserTagID!) {
        userTag(id: $id) {
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

export const createUserTagMutation = gql`
    mutation CreateUserTag($input: UserTagInput!) {
        createUserTag(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateUserTagMutation = gql`
    mutation UpdateUserTag($id: UserTagID!, $input: UserTagPartialInput!) {
        updateUserTag(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteUserTagsMutation = gql`
    mutation DeleteUserTags ($ids: [UserTagID!]!){
        deleteUserTags(ids: $ids)
    }`;


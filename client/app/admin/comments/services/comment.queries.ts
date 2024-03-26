import {gql} from '@apollo/client/core';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

const commentMetaFragment = gql`
    fragment CommentMeta on Comment {
        id
        description
        authorName
        event {
            id
            name
        }
        news {
            id
            name
        }
        creator {
            ...UserMeta
        }
        creationDate
        updateDate
        updater {
            ...UserMeta
        }
        permissions {
            ...PermissionsRUD
        }
    }
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const commentsQuery = gql`
    query Comments($filter: CommentFilter, $sorting: [CommentSorting!], $pagination: PaginationInput) {
        comments(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...CommentMeta
            }
            pageSize
            pageIndex
            length
        }
    }
    ${commentMetaFragment}
`;

export const commentQuery = gql`
    query Comment($id: CommentID!) {
        comment(id: $id) {
            ...CommentMeta
            permissions {
                update
                delete
            }
        }
    }
    ${commentMetaFragment}
`;

export const createComment = gql`
    mutation CreateComment($input: CommentInput!) {
        createComment(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateComment = gql`
    mutation UpdateComment($id: CommentID!, $input: CommentPartialInput!) {
        updateComment(id: $id, input: $input) {
            id
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteComments = gql`
    mutation DeleteComments($ids: [CommentID!]!) {
        deleteComments(ids: $ids)
    }
`;

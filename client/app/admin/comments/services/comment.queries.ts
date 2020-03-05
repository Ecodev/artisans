import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

const commentMetaFragment = gql`
    fragment commentMeta on Comment {
        id
        description
        event {
            id
            name
        }
        news {
            id
            name
        }
        creator {
            ...userMeta
        }
        creationDate
        updateDate
        updater {
            ...userMeta
        }
    }
    ${userMetaFragment}
`;

export const commentsQuery = gql`
    query Comments($filter: CommentFilter, $sorting: [CommentSorting!], $pagination: PaginationInput) {
        comments(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...commentMeta
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
            ...commentMeta
            permissions {
                update
                delete
            }
        }
    }
    ${commentMetaFragment}
`;

export const createComment = gql`
    mutation CreateComment ($input: CommentInput!) {
        createComment (input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const updateComment = gql`
    mutation UpdateComment($id: CommentID!, $input: CommentPartialInput!) {
        updateComment(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }${userMetaFragment}`;

export const deleteComments = gql`
    mutation DeleteComments ($ids: [CommentID!]!){
        deleteComments(ids: $ids)
    }`;

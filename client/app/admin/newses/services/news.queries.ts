import {gql} from '@apollo/client/core';
import {userMetaFragment} from '../../../shared/queries/fragments';

export const newsesQuery = gql`
    query Newses($filter: NewsFilter, $sorting: [NewsSorting!], $pagination: PaginationInput) {
        newses(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                isActive
                name
                description
                date
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const newsQuery = gql`
    query News($id: NewsID!) {
        news(id: $id) {
            id
            isActive
            name
            description
            content
            creationDate
            date
            creator {
                ...UserMeta
            }
            updateDate
            updater {
                ...UserMeta
            }
            permissions {
                update
                delete
            }
        }
    }
    ${userMetaFragment}
`;

export const createNews = gql`
    mutation CreateNews($input: NewsInput!) {
        createNews(input: $input) {
            id
            creationDate
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateNews = gql`
    mutation UpdateNews($id: NewsID!, $input: NewsPartialInput!) {
        updateNews(id: $id, input: $input) {
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteNewses = gql`
    mutation DeleteNewses($ids: [NewsID!]!) {
        deleteNewses(ids: $ids)
    }
`;

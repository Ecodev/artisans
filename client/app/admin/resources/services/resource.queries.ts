import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const resourceMetaFragment = gql`
    fragment itemMeta on Item {
        id
        name
        description
    }
`;

export const resourcesQuery = gql`
    query Items($filter: ItemFilter, $pagination: PaginationInput) {
        items(filter: $filter, pagination: $pagination) {
            items {
                ...itemMeta
            }
            pageSize
            pageIndex
            length
        }
    }
${resourceMetaFragment}`;

export const resourceQuery = gql`
    query Item($id: ItemID!) {
        item(id: $id) {
            id
            ...itemMeta
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
${resourceMetaFragment}
${userMetaFragment}`;

export const createResourceMutation = gql`
    mutation CreateItem ($input: ItemInput!) {
        createItem (input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateResourceMutation = gql`
    mutation UpdateItem($id: ItemID!, $input: ItemPartialInput!) {
        updateItem(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

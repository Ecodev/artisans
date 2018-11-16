import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const itemMetaFragment = gql`
    fragment itemMeta on Item {
        id
        name
        description
    }
`;

export const itemsQuery = gql`
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
${itemMetaFragment}`;

export const itemQuery = gql`
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
${itemMetaFragment}
${userMetaFragment}`;

export const createItemMutation = gql`
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

export const updateItemMutation = gql`
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

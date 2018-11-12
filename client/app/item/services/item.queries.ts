import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const itemsQuery = gql`
query Items($filter: ItemFilter, $pagination: PaginationInput) {
    items(filter: $filter, pagination: $pagination) {
        items {
            id
            name
        }
        pageSize
        pageIndex
        length
    }
}`;

export const itemQuery = gql`
query Item($id: ItemID!) {
    item(id: $id) {
        id
        name
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

export const createItemMutation = gql`
    mutation CreateItem ($input: ItemInput!) {
        createItem (input: $input) {
            id
            name
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

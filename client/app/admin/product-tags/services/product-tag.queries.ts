import {gql} from 'apollo-angular';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const productTagsQuery = gql`
    query ProductTags($filter: ProductTagFilter, $sorting: [ProductTagSorting!], $pagination: PaginationInput) {
        productTags(filter: $filter, sorting: $sorting, pagination: $pagination) {
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

export const productTagQuery = gql`
    query ProductTag($id: ProductTagID!) {
        productTag(id: $id) {
            id
            name
            color
            creationDate
            creator {
                ...UserMeta
            }
            updateDate
            updater {
                ...UserMeta
            }
            permissions {
                ...PermissionsRUD
            }
        }
    }
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const createProductTag = gql`
    mutation CreateProductTag($input: ProductTagInput!) {
        createProductTag(input: $input) {
            id
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateProductTag = gql`
    mutation UpdateProductTag($id: ProductTagID!, $input: ProductTagPartialInput!) {
        updateProductTag(id: $id, input: $input) {
            id
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteProductTags = gql`
    mutation DeleteProductTags($ids: [ProductTagID!]!) {
        deleteProductTags(ids: $ids)
    }
`;

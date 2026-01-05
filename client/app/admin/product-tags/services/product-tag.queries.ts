import {gql} from '@apollo/client/core';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const productTagsQuery = gql`
    query ProductTagsQuery($filter: ProductTagFilter, $sorting: [ProductTagSorting!], $pagination: PaginationInput) {
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
    query ProductTagQuery($id: ProductTagID!) {
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

import {gql} from 'apollo-angular';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const productMetaFragment = gql`
    fragment ProductMeta on Product {
        id
        name
        description
        isActive
        type
        reviewNumber
        releaseDate
        readingDuration
        productTags {
            id
            name
        }
        pricePerUnitCHF
        pricePerUnitEUR
        code
        internalRemarks
        isHighlighted
        image {
            id
        }
        illustration {
            id
        }
        file {
            id
            mime
        }
        creationDate
        creator {
            ...UserMeta
        }
        updateDate
        updater {
            ...UserMeta
        }
    }
    ${userMetaFragment}
`;

export const productsQuery = gql`
    query Products($filter: ProductFilter, $sorting: [ProductSorting!], $pagination: PaginationInput) {
        products(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...ProductMeta
            }
            pageSize
            pageIndex
            length
            totalPricePerUnitCHF
            totalPricePerUnitEUR
        }
    }
    ${productMetaFragment}
`;

export const productQuery = gql`
    query Product($id: ProductID!) {
        product(id: $id) {
            ...ProductMeta
            content
            review {
                id
                name
                reviewNumber
                image {
                    id
                }
                releaseDate
            }
            permissions {
                ...PermissionsRUD
            }
        }
    }
    ${productMetaFragment}
    ${permissionsFragment}
`;

export const createProduct = gql`
    mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            id
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateProduct = gql`
    mutation UpdateProduct($id: ProductID!, $input: ProductPartialInput!) {
        updateProduct(id: $id, input: $input) {
            id
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteProducts = gql`
    mutation DeleteProducts($ids: [ProductID!]!) {
        deleteProducts(ids: $ids)
    }
`;

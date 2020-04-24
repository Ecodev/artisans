import gql from 'graphql-tag';
import { permissionsFragment, userMetaFragment } from '../../../shared/queries/fragments';

export const productMetaFragment = gql`
    fragment productMeta on Product {
        id
        name
        shortDescription
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
            ...userMeta
        }
        updateDate
        updater {
            ...userMeta
        }
    }
    ${userMetaFragment}
`;

export const productsQuery = gql`
    query Products($filter: ProductFilter, $sorting: [ProductSorting!], $pagination: PaginationInput) {
        products(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...productMeta
            }
            pageSize
            pageIndex
            length
            totalPricePerUnitCHF
            totalPricePerUnitEUR
        }
    }
${productMetaFragment}`;

export const productQuery = gql`
    query Product($id: ProductID!) {
        product(id: $id) {
            ...productMeta
            description
            review {
                id
                name
            }
            permissions {
                ...permissions
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
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateProduct = gql`
    mutation UpdateProduct($id: ProductID!, $input: ProductPartialInput!) {
        updateProduct(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteProducts = gql`
    mutation DeleteProducts ($ids: [ProductID!]!){
        deleteProducts(ids: $ids)
    }`;

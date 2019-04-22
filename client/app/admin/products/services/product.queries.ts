import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const productMetaFragment = gql`
    fragment productMeta on Product {
        id
        name
        description
        isActive
        verificationDate
        productTags {
            id
            name
        }
        initialPrice
        periodicPrice
        purchasePrice
        creditAccount {
            id
            name
        }
        code
        remarks
        image {
            id
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
            totalPurchasePrice
            totalInitialPrice
            totalPeriodicPrice
        }
    }
${productMetaFragment}`;

export const usageProductsQuery = gql`
    query UsageProducts($filter: ProductFilter, $sorting: [ProductSorting!], $pagination: PaginationInput) {
        products(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                code
                initialPrice
                periodicPrice
                purchasePrice
                purchasePrice
                creationDate
                updateDate
            }
            pageSize
            pageIndex
            length
            totalPurchasePrice
            totalInitialPrice
            totalPeriodicPrice
        }
    }
`;

export const productQuery = gql`
    query Product($id: ProductID!) {
        product(id: $id) {
            ...productMeta
        }
    }
    ${productMetaFragment}
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
            verificationDate
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

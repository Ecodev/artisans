import gql from 'graphql-tag';
import { permissionsFragment, userMetaFragment } from '../../../shared/queries/fragments';

export const productMetaFragment = gql`
    fragment productMeta on Product {
        id
        name
        description
        isActive
        verificationDate
        ponderatePrice
        productTags {
            id
            name
        }
        pricePerUnit
        unit
        vatRate
        quantity
        minimumQuantity,
        purchaseStatus,
        margin
        supplier
        supplierPrice
        supplierReference
        code
        remarks
        internalRemarks
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
            totalPricePerUnit
            totalSupplierPrice
        }
    }
${productMetaFragment}`;

export const productQuery = gql`
    query Product($id: ProductID!) {
        product(id: $id) {
            ...productMeta
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

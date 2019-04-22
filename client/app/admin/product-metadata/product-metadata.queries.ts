import gql from 'graphql-tag';

export const productMetadatasQuery = gql`
    query ProductMetadatas($filter: ProductMetadataFilter, $sorting: [ProductMetadataSorting!], $pagination: PaginationInput) {
        productMetadatas(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                value
                product {
                    id
                }
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const createProductMetadataMutation = gql`
    mutation CreateProductMetadata ($input: ProductMetadataInput!) {
        createProductMetadata (input: $input) {
            id
        }
    }
`;

export const updateProductMetadataMutation = gql`
    mutation UpdateProductMetadata($id: ProductMetadataID!, $input: ProductMetadataPartialInput!) {
        updateProductMetadata(id:$id, input:$input) {
            id
        }
    }
`;

export const deleteProductMetadatas = gql`
    mutation DeleteProductMetadatas ($ids: [ProductMetadataID!]!){
        deleteProductMetadatas(ids: $ids)
    }
`;


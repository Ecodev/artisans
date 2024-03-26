import {gql} from '@apollo/client/core';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const facilitatorDocumentMetaFragment = gql`
    fragment FacilitatorDocumentMeta on FacilitatorDocument {
        id
        name
        category
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

export const facilitatorDocumentsQuery = gql`
    query FacilitatorDocuments(
        $filter: FacilitatorDocumentFilter
        $sorting: [FacilitatorDocumentSorting!]
        $pagination: PaginationInput
    ) {
        facilitatorDocuments(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...FacilitatorDocumentMeta
            }
            pageSize
            pageIndex
            length
        }
    }
    ${facilitatorDocumentMetaFragment}
`;

export const facilitatorDocumentQuery = gql`
    query FacilitatorDocument($id: FacilitatorDocumentID!) {
        facilitatorDocument(id: $id) {
            ...FacilitatorDocumentMeta
            permissions {
                ...PermissionsRUD
            }
        }
    }
    ${facilitatorDocumentMetaFragment}
    ${permissionsFragment}
`;

export const createFacilitatorDocument = gql`
    mutation CreateFacilitatorDocument($input: FacilitatorDocumentInput!) {
        createFacilitatorDocument(input: $input) {
            id
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateFacilitatorDocument = gql`
    mutation UpdateFacilitatorDocument($id: FacilitatorDocumentID!, $input: FacilitatorDocumentPartialInput!) {
        updateFacilitatorDocument(id: $id, input: $input) {
            id
            name
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteFacilitatorDocuments = gql`
    mutation DeleteFacilitatorDocuments($ids: [FacilitatorDocumentID!]!) {
        deleteFacilitatorDocuments(ids: $ids)
    }
`;

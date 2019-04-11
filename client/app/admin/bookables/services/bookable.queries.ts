import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const bookableMetaFragment = gql`
    fragment bookableMeta on Bookable {
        id
        name
        description
        isActive
        state
        verificationDate
        licenses {
            id
            name
        }
        bookableTags {
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
        simultaneousBookingMaximum
        bookingType
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

export const bookablesQuery = gql`
    query Bookables($filter: BookableFilter, $sorting: [BookableSorting!], $pagination: PaginationInput) {
        bookables(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...bookableMeta
            }
            pageSize
            pageIndex
            length
            totalPurchasePrice
            totalInitialPrice
            totalPeriodicPrice
        }
    }
${bookableMetaFragment}`;

export const bookableQuery = gql`
    query Bookable($id: BookableID!) {
        bookable(id: $id) {
            ...bookableMeta
        }
    }
    ${bookableMetaFragment}
`;

export const createBookable = gql`
    mutation CreateBookable($input: BookableInput!) {
        createBookable(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateBookable = gql`
    mutation UpdateBookable($id: BookableID!, $input: BookablePartialInput!) {
        updateBookable(id:$id, input:$input) {
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

export const deleteBookables = gql`
    mutation DeleteBookables ($ids: [BookableID!]!){
        deleteBookables(ids: $ids)
    }`;

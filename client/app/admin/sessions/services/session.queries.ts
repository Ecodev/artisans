import {gql} from '@apollo/client/core';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const sessionMetaFragment = gql`
    fragment SessionMeta on Session {
        id
        name
        street
        locality
        region
        price
        availability
        dates
        startDate
        endDate
        description
        mailingList
        creationDate
        internalRemarks
        facilitators {
            id
            name
            email
        }
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

export const sessionsQuery = gql`
    query Sessions($filter: SessionFilter, $sorting: [SessionSorting!], $pagination: PaginationInput) {
        sessions(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...SessionMeta
            }
            pageSize
            pageIndex
            length
        }
    }
    ${sessionMetaFragment}
`;

export const sessionQuery = gql`
    query Session($id: SessionID!) {
        session(id: $id) {
            ...SessionMeta
            permissions {
                ...PermissionsRUD
            }
        }
    }
    ${sessionMetaFragment}
    ${permissionsFragment}
`;

export const createSession = gql`
    mutation CreateSession($input: SessionInput!) {
        createSession(input: $input) {
            id
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateSession = gql`
    mutation UpdateSession($id: SessionID!, $input: SessionPartialInput!) {
        updateSession(id: $id, input: $input) {
            id
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteSessions = gql`
    mutation DeleteSessions($ids: [SessionID!]!) {
        deleteSessions(ids: $ids)
    }
`;

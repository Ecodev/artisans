import gql from 'graphql-tag';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

export const sessionMetaFragment = gql`
    fragment sessionMeta on Session {
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
        facilitators {
            id
            name
            email
        }
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

export const sessionsQuery = gql`
    query Sessions($filter: SessionFilter, $sorting: [SessionSorting!], $pagination: PaginationInput) {
        sessions(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...sessionMeta
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
            ...sessionMeta
            permissions {
                ...permissions
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
                ...userMeta
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
                ...userMeta
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

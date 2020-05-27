import gql from 'graphql-tag';
import {userMetaFragment} from '../../../shared/queries/fragments';

export const eventsQuery = gql`
    query Events($filter: EventFilter, $sorting: [EventSorting!], $pagination: PaginationInput) {
        events(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                type
                place
                date
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const eventQuery = gql`
    query Event($id: EventID!) {
        event(id: $id) {
            id
            name
            type
            place
            creationDate
            date
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
            permissions {
                update
                delete
            }
        }
    }
    ${userMetaFragment}
`;

export const createEvent = gql`
    mutation CreateEvent($input: EventInput!) {
        createEvent(input: $input) {
            id
            creationDate
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateEvent = gql`
    mutation UpdateEvent($id: EventID!, $input: EventPartialInput!) {
        updateEvent(id: $id, input: $input) {
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteEvents = gql`
    mutation DeleteEvents($ids: [EventID!]!) {
        deleteEvents(ids: $ids)
    }
`;

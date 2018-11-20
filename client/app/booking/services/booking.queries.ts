import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const bookingMetaFragment = gql`
    fragment bookingMeta on Booking {
        id
        destination
        startComment
        startDate
        endComment
        endDate
        estimatedEndDate
        creationDate
        updateDate
        participantCount
        responsible {
            id
            ...userMeta
        }
        owner {
            id
            ...userMeta
        }
        resources {
            id
            name
        }
    }
${userMetaFragment}`;

export const bookingsQuery = gql`
    query Bookings($filter: BookingFilter, $pagination: PaginationInput) {
        bookings(filter: $filter, pagination: $pagination) {
            items {
                ...bookingMeta
            }
            pageSize
            pageIndex
            length
        }
    }
${bookingMetaFragment}`;

export const bookingQuery = gql`
    query Booking($id: BookingID!) {
        booking(id: $id) {
            ...bookingMeta
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
${userMetaFragment}`;

export const createBookingMutation = gql`
    mutation CreateBooking ($input: BookingInput!) {
        createBooking (input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateBookingMutation = gql`
    mutation UpdateBooking($id: BookingID!, $input: BookingPartialInput!) {
        updateBooking(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

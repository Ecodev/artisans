import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';
import { bookableMetaFragment } from '../../bookables/services/bookable.queries';

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
        status
        owner {
            id
            ...userMeta
        }
        creator {
            id
            name
        }
        bookables {
            id
            name
            ...bookableMeta
        }
    }
    ${bookableMetaFragment}
${userMetaFragment}`;

export const bookingsQuery = gql`
    query Bookings($filter: BookingFilter, $sorting: [BookingSorting!], $pagination: PaginationInput) {
        bookings(filter: $filter, sorting: $sorting, pagination: $pagination) {
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
            creationDate
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${bookingMetaFragment}
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

export const deleteBookingsMutation = gql`
    mutation DeleteBookings ($ids: [BookingID!]!){
        deleteBookings(ids: $ids)
    }
`;

export const terminateBookingMutation = gql`
    mutation TerminateBooking ($id: BookingID!, $comment: String) {
        terminateBooking(id: $id, comment: $comment) {
            id
            status
        }
    }
`;

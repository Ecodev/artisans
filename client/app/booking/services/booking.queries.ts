import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const bookingsQuery = gql`
    query Bookings($filter: BookingFilter, $pagination: PaginationInput) {
        bookings(filter: $filter, pagination: $pagination) {
            items {
                id
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const bookingQuery = gql`
    query Booking($id: BookingID!) {
        booking(id: $id) {
            id
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

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { pick } from 'lodash';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { bookingQuery, bookingsQuery, createBookingMutation, updateBookingMutation } from './booking.queries';
import {
    BookingInput,
    BookingPartialInput,
    BookingQuery,
    BookingQueryVariables,
    BookingsQuery,
    BookingsQueryVariables,
    UpdateBookingMutation,
    UpdateBookingMutationVariables,
} from '../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class BookingService extends AbstractModelService<BookingQuery['booking'],
    BookingQueryVariables,
    BookingsQuery['bookings'],
    BookingsQueryVariables,
    any,
    any,
    UpdateBookingMutation['updateBooking'],
    UpdateBookingMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'booking',
            bookingQuery,
            bookingsQuery,
            createBookingMutation,
            updateBookingMutation,
            null);
    }

    public getEmptyObject(): BookingInput {
        return {
            startDate: '2018',
            endDate: '2018',
        };
    }

    public flagEndDate(id: string) {
        const date = (new Date()).toISOString();
        const booking = {id : id, endDate: date};
        this.updateNow(booking).subscribe(() => {
        });
    }

}

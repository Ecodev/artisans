import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { pick } from 'lodash';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { bookingQuery, bookingsQuery, createBookingMutation, updateBookingMutation } from './booking.queries';
import {
    BookingInput,
    BookingQuery,
    BookingQueryVariables,
    BookingsQuery,
    BookingsQueryVariables,
    BookingStatus,
    BookingType,
    UpdateBookingMutation,
    UpdateBookingMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumService } from '../../../shared/services/enum.service';
import { BookingResolve } from '../booking';

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

    public static readonly runningSelfApprovedQV: BookingsQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [{endDate: {null: {not: false}}}],
                    joins: {bookables: {conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}},
                },
            ],
        },
    };

    public static readonly selfApprovedQV: BookingsQueryVariables = {
        filter: {groups: [{joins: {bookables: {conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}}}]},
    };

    public static readonly storageApplication: BookingsQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                    joins: {bookables: {conditions: [{bookableTags: {have: {values: ['6008'], not: false}}}]}},
                },
            ],
        },
    };

    public static readonly notStorageApplication: BookingsQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                    joins: {bookables: {conditions: [{bookableTags: {have: {values: ['6008'], not: true}}}]}},
                },
            ],
        },
    };

    constructor(apollo: Apollo, private enumService: EnumService) {
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
            status: BookingStatus.booked,
            responsible: null,
            destination: '',
            participantCount: 1,
            startComment: '',
            endComment: '',
            estimatedEndDate: '',
            startDate: (new Date()).toISOString(),
            endDate: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            responsible: [Validators.required],
        };
    }

    public flagEndDate(id: string): void {
        const date = (new Date()).toISOString();
        const booking = {id: id, endDate: date};
        this.updateNow(booking).subscribe(() => {
        });
    }

    public resolve(id: string): Observable<BookingResolve> {

        const observables = [
            super.resolve(id),
            this.enumService.get('BookingStatus'),
        ];

        return forkJoin(observables).pipe(map((data: any) => {
            return {
                model: data[0].model,
                status: data[1],
            };
        }));
    }

}

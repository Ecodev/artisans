import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { bookingQuery, bookingsQuery, createBooking, deleteBookings, terminateBooking, updateBooking } from './booking.queries';
import {
    Bookable,
    Booking,
    BookingInput,
    BookingPartialInput,
    Bookings,
    BookingStatus,
    BookingsVariables,
    BookingType,
    BookingVariables,
    CreateBooking,
    DeleteBookings,
    JoinType,
    LogicalOperator,
    TerminateBooking,
    UpdateBooking,
    UpdateBookingVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingResolve } from '../booking';
import { AbstractModelService, FormValidators } from '../../../natural/services/abstract-model.service';
import { EnumService } from '../../../natural/services/enum.service';
import { BookableTagService } from '../../bookableTags/services/bookableTag.service';

@Injectable({
    providedIn: 'root',
})
export class BookingService extends AbstractModelService<Booking['booking'],
    BookingVariables,
    Bookings['bookings'],
    BookingsVariables,
    any,
    any,
    UpdateBooking['updateBooking'],
    UpdateBookingVariables,
    DeleteBookings> {

    /**
     * Filters for bookings with endDate with self-approved bookable or no bookable linked
     */
    public static readonly runningSelfApprovedQV: BookingsVariables = {
        filter: {
            groups: [
                {
                    conditions: [{endDate: {null: {}}}],
                    joins: {
                        bookable: {
                            type: JoinType.leftJoin,
                            conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}],
                        },
                    },
                },
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [
                        {
                            endDate: {null: {}},
                            bookable: {empty: {}},
                        },
                    ],
                },
            ],
        },
        pagination: {
            pageSize: 1000,
        },
    };

    public static readonly selfApprovedQV: BookingsVariables = {
        filter: {
            groups: [
                {
                    joins: {
                        bookable: {
                            type: JoinType.leftJoin,
                            conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}],
                        },
                    },
                },
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [{bookable: {empty: {}}}],
                },
            ],

        },
    };

    public static readonly storageApplication: BookingsVariables = {
        filter: {
            groups: [
                {
                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                    joins: {
                        bookable: {
                            conditions: [
                                {
                                    bookableTags: {have: {values: [BookableTagService.STORAGE]}},
                                    bookingType: {equal: {value: BookingType.admin_approved}},
                                },
                            ],
                        },
                    },
                },
            ],
        },
    };

    public static readonly notStorageApplication: BookingsVariables = {
        filter: {
            groups: [
                {
                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                    joins: {bookable: {conditions: [{bookableTags: {have: {values: [BookableTagService.STORAGE], not: true}}}]}},
                },
            ],
        },
    };

    constructor(apollo: Apollo, private enumService: EnumService) {
        super(apollo,
            'booking',
            bookingQuery,
            bookingsQuery,
            createBooking,
            updateBooking,
            deleteBookings);
    }

    public getEmptyObject(): BookingInput {
        return {
            status: BookingStatus.booked,
            owner: null,
            bookable: null,
            destination: '',
            participantCount: 1,
            startComment: '',
            endComment: '',
            estimatedEndDate: '',
            startDate: (new Date()).toISOString(),
            endDate: '',
            remarks: '',
            internalRemarks: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            owner: [Validators.required],
        };
    }

    public terminateBooking(id: string, comment: string = ''): Observable<TerminateBooking['terminateBooking']> {
        return this.mutate(terminateBooking, {id: id, comment: comment});
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

    /**
     * Create a booking with given owner and bookable.
     * Accepts optional third parameter with other default fields of booking
     */
    public createWithBookable(bookable: Bookable['bookable'],
                              owner: { id: string },
                              booking: BookingPartialInput = {}): Observable<CreateBooking['createBooking']> {

        if (!booking.startDate) {
            booking.startDate = (new Date()).toISOString();
        }

        if (!booking.status) {
            booking.status = BookingStatus.application;
        }

        booking.owner = owner ? owner.id : null;
        booking.bookable = bookable ? bookable.id : null;

        return this.create(booking);
    }

}

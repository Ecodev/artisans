import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { pick } from 'lodash';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { bookingQuery, bookingsQuery, createBooking, deleteBookings, terminateBooking, updateBooking } from './booking.queries';
import {
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
import { forkJoin, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumService } from '../../../shared/services/enum.service';
import { BookingResolve } from '../booking';
import { LinkMutationService } from '../../../shared/services/link-mutation.service';

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
     * Filters for bookings with endDate with self-approved bookables or no bookable linked
     */
    public static readonly runningSelfApprovedQV: BookingsVariables = {
        filter: {
            groups: [
                {
                    conditions: [{endDate: {null: {}}}],
                    joins: {bookables: {type: JoinType.leftJoin, conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}},
                },
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [
                        {
                            endDate: {null: {}},
                            bookables: {empty: {}},
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
                {joins: {bookables: {type: JoinType.leftJoin, conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}}},
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [{bookables: {empty: {}}}],
                },
            ],

        },
    };

    public static readonly storageApplication: BookingsVariables = {
        filter: {
            groups: [
                {
                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                    joins: {bookables: {conditions: [{bookableTags: {have: {values: ['6008']}}}]}},
                },
            ],
        },
    };

    public static readonly notStorageApplication: BookingsVariables = {
        filter: {
            groups: [
                {
                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                    joins: {bookables: {conditions: [{bookableTags: {have: {values: ['6008'], not: true}}}]}},
                },
            ],
        },
    };

    constructor(apollo: Apollo, private enumService: EnumService, private linkMutationService: LinkMutationService) {
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
     * @param bookable null | Bookable['bookable'] and LinkableObject TODO : type when we can #6113
     */
    public createWithBookable(bookable,
                              owner: { id: string },
                              booking: BookingPartialInput = {}): Observable<CreateBooking['createBooking']> {

        const subject = new Subject<CreateBooking['createBooking']>();

        if (!booking.startDate) {
            booking.startDate = (new Date()).toISOString();
        }

        if (!booking.status) {
            booking.status = BookingStatus.application;
        }

        booking.owner = owner ? owner.id : null;

        this.create(booking).subscribe(newBoooking => {
            if (bookable) {
                this.linkMutationService.link(newBoooking, bookable).subscribe(() => {
                    subject.next(newBoooking);
                    subject.complete();
                });
            } else {
                subject.next(newBoooking);
                subject.complete();
            }
        });

        return subject.asObservable();

    }

}

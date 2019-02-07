import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { pick } from 'lodash';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    bookingQuery,
    bookingsQuery,
    createBookingMutation,
    deleteBookingsMutation,
    terminateBookingMutation,
    updateBookingMutation,
} from './booking.queries';
import {
    BookingInput,
    BookingPartialInput,
    BookingQuery,
    BookingQueryVariables,
    BookingsQuery,
    BookingsQueryVariables,
    BookingStatus,
    BookingType,
    CreateBookingMutation,
    DeleteBookingsMutation,
    JoinType,
    LogicalOperator,
    TerminateBookingMutation,
    UpdateBookingMutation,
    UpdateBookingMutationVariables,
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
export class BookingService extends AbstractModelService<BookingQuery['booking'],
    BookingQueryVariables,
    BookingsQuery['bookings'],
    BookingsQueryVariables,
    any,
    any,
    UpdateBookingMutation['updateBooking'],
    UpdateBookingMutationVariables,
    DeleteBookingsMutation> {

    /**
     * Filters for bookings with endDate with self-approved bookables or no bookable linked
     */
    public static readonly runningSelfApprovedQV: BookingsQueryVariables = {
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
    };

    public static readonly selfApprovedQV: BookingsQueryVariables = {
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

    public static readonly storageApplication: BookingsQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                    joins: {bookables: {conditions: [{bookableTags: {have: {values: ['6008']}}}]}},
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

    constructor(apollo: Apollo, private enumService: EnumService, private linkMutationService: LinkMutationService) {
        super(apollo,
            'booking',
            bookingQuery,
            bookingsQuery,
            createBookingMutation,
            updateBookingMutation,
            deleteBookingsMutation);
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
            guest: false,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            owner: [Validators.required],
        };
    }

    /**
     * TODO : implement confirm (modal maybe or from controller text)
     */
    public flagEndDate(id: string): Observable<TerminateBookingMutation['terminateBooking']> {
        return this.mutate(terminateBookingMutation, {id: id, comment: ''});
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
     * @param bookable null | BookableQuery['bookable'] and LinkableObject TODO : type when we can #6113
     */
    public createWithBookable(bookable,
                              owner: { id: string },
                              booking: BookingPartialInput = {}): Observable<CreateBookingMutation['createBooking']> {

        const subject = new Subject<CreateBookingMutation['createBooking']>();

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

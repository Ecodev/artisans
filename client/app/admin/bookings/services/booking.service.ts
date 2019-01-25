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
import { LinkableObject, LinkMutationService } from '../../../shared/services/link-mutation.service';

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

                    conditions: [{endDate: {null: {not: false}}}],
                    joins: {bookables: {type: JoinType.leftJoin, conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}},
                },
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [
                        {
                            endDate: {null: {not: false}},
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
    public flagEndDate(id: string, confirm: boolean = false): Observable<TerminateBookingMutation['terminateBooking']> {
        return this.mutate(terminateBookingMutation, {id: id});
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

    public createWithBookable(bookable: LinkableObject,
                              user: { id: string },
                              status: BookingStatus = BookingStatus.application): Observable<CreateBookingMutation['createBooking']> {

        const subject = new Subject<CreateBookingMutation['createBooking']>();

        const booking: BookingInput = {
            status: status,
            startDate: (new Date()).toISOString(),
            owner: user.id,
        };

        this.create(booking).subscribe(newBoooking => {
            this.linkMutationService.link(newBoooking, bookable).subscribe(() => {
                subject.next(newBoooking);
                subject.complete();
            });
        });

        return subject.asObservable();

    }

}

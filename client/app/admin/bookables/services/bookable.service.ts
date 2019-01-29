import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    bookableQuery,
    bookablesQuery,
    createBookableMutation,
    deleteBookablesMutation,
    updateBookableMutation,
} from './bookable.queries';
import {
    BookableInput,
    BookableQuery,
    BookableQueryVariables,
    BookablesQuery,
    BookablesQueryVariables,
    BookableState,
    BookingsQueryVariables,
    BookingType,
    CreateBookableMutation,
    CreateBookableMutationVariables,
    CurrentUserForProfileQuery,
    DeleteBookablesMutation,
    UpdateBookableMutation,
    UpdateBookableMutationVariables,
    UserQuery,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';
import { map } from 'rxjs/operators';
import { BookingService } from '../../bookings/services/booking.service';
import { intersectionBy } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class BookableService extends AbstractModelService<BookableQuery['bookable'],
    BookableQueryVariables,
    BookablesQuery['bookables'],
    BookablesQueryVariables,
    CreateBookableMutation['createBookable'],
    CreateBookableMutationVariables,
    UpdateBookableMutation['updateBookable'],
    UpdateBookableMutationVariables,
    DeleteBookablesMutation> {

    public static readonly membershipServices: BookablesQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [
                        {
                            bookingType: {in: {values: [BookingType.self_approved], not: true}},
                            bookableTags: {have: {values: ['6007']}},
                        },
                    ],
                },
            ],
        },
    };

    public static readonly adminApproved: BookablesQueryVariables = {
        filter: {groups: [{conditions: [{bookingType: {in: {values: [BookingType.admin_approved]}}}]}]},
    };

    constructor(apollo: Apollo, private bookingService: BookingService) {
        super(apollo,
            'bookable',
            bookableQuery,
            bookablesQuery,
            createBookableMutation,
            updateBookableMutation,
            deleteBookablesMutation);
    }

    public static getFiltersByTagId(tagId): BookablesQueryVariables {
        return {filter: {groups: [{conditions: [{bookableTags: {have: {values: [tagId]}}}]}]}};
    }

    public static adminByTag(tagId): BookablesQueryVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                bookingType: {in: {values: [BookingType.admin_only]}},
                                bookableTags: {have: {values: [tagId]}},
                            },
                        ],
                    },
                ],
            },
        };
    }

    public static isLicenceGranted(bookable: BookableQuery['bookable'],
                                   user: UserQuery['user'] | CurrentUserForProfileQuery['viewer']): boolean {

        if (!bookable || !user) {
            return false;
        }

        // If no constraints on bookable, there is not need for licence
        if (bookable.licenses.length === 0) {
            return true;
        }

        return intersectionBy(bookable.licenses, user.licenses, 'id').length;
    }

    public getEmptyObject(): BookableInput {
        return {
            name: '',
            code: '',
            description: '',
            initialPrice: '0',
            periodicPrice: '0',
            simultaneousBookingMaximum: -1,
            bookingType: BookingType.admin_only,
            remarks: '',
            isActive: true,
            state: BookableState.good,
            verificationDate: null,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            code: [Validators.required, Validators.maxLength(100)],
            initialPrice: [Validators.min(0)],
            periodicPrice: [Validators.min(0)],
        };
    }

    public getMandatoryBookables(): Observable<BookablesQuery['bookables']> {
        const mandatoryBookablesFilter: BookablesQueryVariables = {
            filter: {groups: [{conditions: [{bookingType: {in: {values: [BookingType.mandatory]}}}]}]},
        };

        const qvm = new QueryVariablesManager<BookablesQueryVariables>();
        qvm.set('variables', mandatoryBookablesFilter);
        return this.getAll(qvm);
    }

    public canBook(bookable: BookableQuery['bookable'],
                   user: UserQuery['user'] | CurrentUserForProfileQuery['viewer']): Observable<boolean> {
        return this.isAvailable(bookable).pipe(map(isAvailable => isAvailable && BookableService.isLicenceGranted(bookable, user)));
    }

    public isAvailable(bookable: BookableQuery['bookable']): Observable<boolean> {

        if (!bookable.isActive) {
            return of(false);
        }

        // Variable for pending bookings related to given bookable
        const variables: BookingsQueryVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                bookables: {have: {values: [bookable.id]}},
                                endDate: {null: {}},
                            },
                        ],
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<BookingsQueryVariables>();
        qvm.set('variables', variables);
        return this.bookingService.getAll(qvm).pipe(map(result => {
            return bookable.simultaneousBookingMaximum > result.length;
        }));
    }

    public resolveByCode(code: string): Observable<{ model: any }> {

        if (code) {
            const qvm = new QueryVariablesManager<BookablesQueryVariables>();
            const variables: BookablesQueryVariables = {
                filter: {groups: [{conditions: [{code: {equal: {value: code}}}]}]},
            };
            qvm.set('variables', variables);

            return this.getAll(qvm).pipe(map(result => {
                return {model: result && result.items.length ? result.items[0] : {}};
            }));
        } else {
            return of({model: null});
        }

    }

}

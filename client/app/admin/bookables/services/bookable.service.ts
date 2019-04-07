import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { bookableQuery, bookablesQuery, createBookable, deleteBookables, updateBookable } from './bookable.queries';
import {
    Bookable,
    BookableInput,
    Bookables,
    BookableState,
    BookablesVariables,
    BookableVariables,
    Bookings,
    BookingsVariables,
    BookingType,
    CreateBookable,
    CreateBookableVariables,
    CurrentUserForProfile,
    DeleteBookables,
    LogicalOperator,
    UpdateBookable,
    UpdateBookableVariables,
    User,
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
export class BookableService extends AbstractModelService<Bookable['bookable'],
    BookableVariables,
    Bookables['bookables'],
    BookablesVariables,
    CreateBookable['createBookable'],
    CreateBookableVariables,
    UpdateBookable['updateBookable'],
    UpdateBookableVariables,
    DeleteBookables> {

    public static readonly membershipServices: BookablesVariables = {
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
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [
                        {
                            bookingType: {in: {values: [BookingType.admin_approved]}},
                            bookableTags: {have: {values: ['6008']}},
                        },
                    ],
                },
            ],
        },
    };

    public static readonly adminApproved: BookablesVariables = {
        filter: {groups: [{conditions: [{bookingType: {in: {values: [BookingType.admin_approved]}}}]}]},
    };

    constructor(apollo: Apollo, private bookingService: BookingService) {
        super(apollo,
            'bookable',
            bookableQuery,
            bookablesQuery,
            createBookable,
            updateBookable,
            deleteBookables);
    }

    public static getFiltersByTagId(tagId): BookablesVariables {
        return {filter: {groups: [{conditions: [{bookableTags: {have: {values: [tagId]}}}]}]}};
    }

    public static adminApprovedByTag(tagId): BookablesVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                bookingType: {in: {values: [BookingType.admin_approved]}},
                                bookableTags: {have: {values: [tagId]}},
                            },
                        ],
                    },
                ],
            },
        };
    }

    public static adminByTag(tagId): BookablesVariables {
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

    public static isLicenseGranted(bookable: Bookable['bookable'],
                                   user: User['user'] | CurrentUserForProfile['viewer']): boolean {

        if (!bookable || !user) {
            return false;
        }

        // If no constraints on bookable, there is not need for license
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
            purchasePrice: '0',
            simultaneousBookingMaximum: 1,
            bookingType: BookingType.self_approved,
            internalRemarks: '',
            isActive: true,
            state: BookableState.good,
            verificationDate: null,
            image: null,
            creditAccount: null,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            code: [Validators.maxLength(100)],
            initialPrice: [Validators.min(0)],
            periodicPrice: [Validators.min(0)],
        };
    }

    public getMandatoryBookables(): Observable<Bookables['bookables']> {
        const mandatoryBookablesFilter: BookablesVariables = {
            filter: {groups: [{conditions: [{bookingType: {in: {values: [BookingType.mandatory]}}}]}]},
        };

        const qvm = new QueryVariablesManager<BookablesVariables>();
        qvm.set('variables', mandatoryBookablesFilter);
        return this.getAll(qvm); // getAll because mandatory bookables should not change
    }

    public getAvailability(bookable: Bookable['bookable']):
        Observable<{ isAvailable: boolean, result: Bookings['bookings'] }> {

        // Variable for pending bookings related to given bookable
        const variables: BookingsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                bookable: {have: {values: [bookable.id]}},
                                endDate: {null: {}},
                            },
                        ],
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<BookingsVariables>();
        qvm.set('variables', variables);

        return this.bookingService.getAll(qvm).pipe(map(result => {
            const isAvailable = bookable.isActive && (
                bookable.simultaneousBookingMaximum < 0
                || bookable.simultaneousBookingMaximum > result.length
            );

            return {
                isAvailable: isAvailable,
                result: result,
            };
        }));
    }

    public resolveByCode(code: string): Observable<{ model: any }> {

        if (code) {
            const qvm = new QueryVariablesManager<BookablesVariables>();
            const variables: BookablesVariables = {
                filter: {groups: [{conditions: [{code: {equal: {value: code}}}]}]},
            };
            qvm.set('variables', variables);

            return this.getAll(qvm).pipe(map(result => {
                return {model: result && result.items.length ? result.items[0] : null};
            }));
        } else {
            return of({model: null});
        }

    }

}

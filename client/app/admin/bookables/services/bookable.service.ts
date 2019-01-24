import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { bookableQuery, bookablesQuery, createBookableMutation, deleteBookablesMutation, updateBookableMutation } from './bookable.queries';
import {
    BookableInput,
    BookableQuery,
    BookableQueryVariables,
    BookablesQuery,
    BookablesQueryVariables,
    BookingType,
    CreateBookableMutation,
    CreateBookableMutationVariables,
    DeleteBookablesMutation,
    UpdateBookableMutation,
    UpdateBookableMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { BookableResolve } from '../bookable';
import { forkJoin, Observable } from 'rxjs';
import { EnumService } from '../../../shared/services/enum.service';
import { map } from 'rxjs/operators';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';

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

    constructor(apollo: Apollo, private enumService: EnumService) {
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

    public getEmptyObject(): BookableInput {
        return {
            name: '',
            code: '',
            description: '',
            initialPrice: 0,
            periodicPrice: 0,
            simultaneousBookingMaximum: -1,
            bookingType: BookingType.admin_only,
            remarks: '',
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

    public resolve(id: string): Observable<BookableResolve> {

        // Load enums
        const bookingTypes = this.enumService.get('BookingType');

        const observables = [
            super.resolve(id),
            bookingTypes,
        ];

        return forkJoin(observables).pipe(map((data: any) => {
            return {
                model: data[0].model,
                bookingType: data[1],
            };
        }));
    }

    public getMandatoryBookables(): Observable<BookablesQuery['bookables']> {
        const mandatoryBookablesFilter: BookablesQueryVariables = {
            filter: {groups: [{conditions: [{bookingType: {in: {values: [BookingType.mandatory]}}}]}]},
        };

        const qvm = new QueryVariablesManager<BookablesQueryVariables>();
        qvm.set('variables', mandatoryBookablesFilter);
        return this.getAll(qvm);
    }

}

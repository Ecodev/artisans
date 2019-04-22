import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { bookableQuery, bookablesQuery, createBookable, deleteBookables, updateBookable } from './bookable.queries';
import {
    Bookable,
    BookableInput,
    Bookables,
    BookableState,
    BookablesVariables,
    BookableVariables,
    CreateBookable,
    CreateBookableVariables,
    DeleteBookables,
    LogicalOperator,
    UpdateBookable,
    UpdateBookableVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormValidators, NaturalAbstractModelService, NaturalQueryVariablesManager } from '@ecodev/natural';
import { BookableTagService } from '../../bookableTags/services/bookableTag.service';

@Injectable({
    providedIn: 'root',
})
export class BookableService extends NaturalAbstractModelService<Bookable['bookable'],
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
                            bookableTags: {have: {values: [BookableTagService.SERVICE]}},
                        },
                    ],
                },
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [
                        {
                            bookableTags: {have: {values: [BookableTagService.STORAGE]}},
                        },
                    ],
                },
            ],
        },
    };

    constructor(apollo: Apollo) {
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

    public static adminByTag(tagId): BookablesVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                bookableTags: {have: {values: [tagId]}},
                            },
                        ],
                    },
                ],
            },
        };
    }

    protected getDefaultForServer(): BookableInput {
        return {
            name: '',
            code: '',
            description: '',
            initialPrice: '0',
            periodicPrice: '0',
            purchasePrice: '0',
            remarks: '',
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
        };
    }

    public resolveByCode(code: string): Observable<{ model: any }> {

        if (code) {
            const qvm = new NaturalQueryVariablesManager<BookablesVariables>();
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

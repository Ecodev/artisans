import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { createBookableMutation, bookableQuery, bookablesQuery, updateBookableMutation } from './bookable.queries';
import {
    CreateBookableMutation,
    CreateBookableMutationVariables,
    BookableInput,
    BookableQuery,
    BookableQueryVariables,
    BookablesQuery,
    BookablesQueryVariables,
    UpdateBookableMutation,
    UpdateBookableMutationVariables,
} from '../../../shared/generated-types';

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
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'bookable',
            bookableQuery,
            bookablesQuery,
            createBookableMutation,
            updateBookableMutation,
            null);
    }

    public getEmptyObject(): BookableInput {
        return {
            name: '',
            description: '',
        };
    }

}

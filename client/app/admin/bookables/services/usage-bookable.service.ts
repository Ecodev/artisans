import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    bookableQuery,
    createBookable,
    deleteBookables,
    updateBookable,
    usageBookablesQuery,
} from './bookable.queries';
import {
    Bookable,
    Bookables,
    BookableVariables,
    CreateBookable,
    CreateBookableVariables,
    DeleteBookables,
    UpdateBookable,
    UpdateBookableVariables,
    UsageBookablesVariables,
} from '../../../shared/generated-types';
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class UsageBookableService extends NaturalAbstractModelService<Bookable['bookable'],
    BookableVariables,
    Bookables['bookables'],
    UsageBookablesVariables,
    CreateBookable['createBookable'],
    CreateBookableVariables,
    UpdateBookable['updateBookable'],
    UpdateBookableVariables,
    DeleteBookables> {

    constructor(apollo: Apollo) {
        super(apollo,
            'bookable',
            bookableQuery,
            usageBookablesQuery,
            createBookable,
            updateBookable,
            deleteBookables);
    }

}

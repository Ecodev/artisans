import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { bookableTypeQuery, bookableTypesQuery } from './bookableType.queries';
import {
    BookableTypeQuery,
    BookableTypeQueryVariables,
    BookableTypesQuery,
    BookableTypesQueryVariables,
} from '../../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class BookableTypeService extends AbstractModelService<BookableTypeQuery['bookableType'],
    BookableTypeQueryVariables,
    BookableTypesQuery['bookableTypes'],
    BookableTypesQueryVariables, null, any, null, any,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'bookableType',
            bookableTypeQuery,
            bookableTypesQuery,
            null,
            null,
            null);
    }

}

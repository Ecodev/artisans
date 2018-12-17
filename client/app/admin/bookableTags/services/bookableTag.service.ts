import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    bookableTagQuery,
    bookableTagsQuery,
    createBookableTagMutation,
    deleteBookableTagsMutation,
    updateBookableTagMutation,
} from './bookableTag.queries';
import {
    BookableTagInput,
    BookableTagQuery,
    BookableTagQueryVariables,
    BookableTagsQuery,
    BookableTagsQueryVariables,
    CreateBookableTagMutation,
    CreateBookableTagMutationVariables,
    UpdateBookableTagMutation,
    UpdateBookableTagMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class BookableTagService extends AbstractModelService<BookableTagQuery['bookableTag'],
    BookableTagQueryVariables,
    BookableTagsQuery['bookableTags'],
    BookableTagsQueryVariables,
    CreateBookableTagMutation['createBookableTag'],
    CreateBookableTagMutationVariables,
    UpdateBookableTagMutation['updateBookableTag'],
    UpdateBookableTagMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'bookableTag',
            bookableTagQuery,
            bookableTagsQuery,
            createBookableTagMutation,
            updateBookableTagMutation,
            deleteBookableTagsMutation);
    }

    public getEmptyObject(): BookableTagInput {
        return {
            name: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}

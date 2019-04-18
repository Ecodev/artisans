import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../natural/services/abstract-model.service';
import { bookableTagQuery, bookableTagsQuery, createBookableTag, deleteBookableTags, updateBookableTag } from './bookableTag.queries';
import {
    BookableTag,
    BookableTagInput,
    BookableTags,
    BookableTagsVariables,
    BookableTagVariables,
    CreateBookableTag,
    CreateBookableTagVariables,
    UpdateBookableTag,
    UpdateBookableTagVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class BookableTagService extends AbstractModelService<BookableTag['bookableTag'],
    BookableTagVariables,
    BookableTags['bookableTags'],
    BookableTagsVariables,
    CreateBookableTag['createBookableTag'],
    CreateBookableTagVariables,
    UpdateBookableTag['updateBookableTag'],
    UpdateBookableTagVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'bookableTag',
            bookableTagQuery,
            bookableTagsQuery,
            createBookableTag,
            updateBookableTag,
            deleteBookableTags);
    }

    public static readonly SERVICE = '6007';
    public static readonly STORAGE = '6008';

    protected getDefaultForServer(): BookableTagInput {
        return {
            name: '',
            color: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    bookableMetadatasQuery,
    createBookableMetadataMutation,
    deleteBookableMetadatas,
    updateBookableMetadataMutation,
} from './bookable-metadata.queries';
import { Validators } from '@angular/forms';

import { AbstractModelService, FormValidators } from '../../natural/services/abstract-model.service';
import {
    BookableMetadataInput,
    BookableMetadatas,
    BookableMetadatasVariables, DeleteBookableMetadatas,
    UpdateBookableMetadata,
    UpdateBookableMetadataVariables,
} from '../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class BookableMetadataService extends AbstractModelService<any,
    any,
    BookableMetadatas['bookableMetadatas'],
    BookableMetadatasVariables,
    any,
    any,
    UpdateBookableMetadata['updateBookableMetadata'],
    UpdateBookableMetadataVariables,
    DeleteBookableMetadatas> {

    constructor(apollo: Apollo) {
        super(apollo,
            'bookableMetadata',
            null,
            bookableMetadatasQuery,
            createBookableMetadataMutation,
            updateBookableMetadataMutation,
            deleteBookableMetadatas);
    }

    protected getDefaultForServer(): BookableMetadataInput {
        return {
            name: '',
            value: '',
            bookable: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required],
            value: [Validators.required],
        };
    }

}

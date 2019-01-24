import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { pick } from 'lodash';
import {
    bookableMetadatasQuery,
    createBookableMetadataMutation,
    deleteBookableMetadatasMutation,
    updateBookableMetadataMutation,
} from './bookable-metadata.queries';
import { Validators } from '@angular/forms';
import { AbstractModelService, FormValidators } from '../../services/abstract-model.service';
import {
    BookableMetadataInput,
    BookableMetadatasQuery,
    BookableMetadatasQueryVariables,
    DeleteBookableMetadatasMutation,
    UpdateBookableMetadataMutation,
    UpdateBookableMetadataMutationVariables,
} from '../../generated-types';

@Injectable({
    providedIn: 'root',
})
export class BookableMetadataService extends AbstractModelService<any,
    any,
    BookableMetadatasQuery['bookableMetadatas'],
    BookableMetadatasQueryVariables,
    any,
    any,
    UpdateBookableMetadataMutation['updateBookableMetadata'],
    UpdateBookableMetadataMutationVariables,
    DeleteBookableMetadatasMutation> {

    constructor(apollo: Apollo) {
        super(apollo,
            'bookableMetadata',
            null,
            bookableMetadatasQuery,
            createBookableMetadataMutation,
            updateBookableMetadataMutation,
            deleteBookableMetadatasMutation);
    }

    public getEmptyObject(): BookableMetadataInput {
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

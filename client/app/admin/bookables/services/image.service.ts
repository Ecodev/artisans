import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';

import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';
import { CreateImageMutation, CreateImageMutationVariables, ImageInput } from '../../../shared/generated-types';

export const createImageMutation = gql`
    mutation CreateImage($input: ImageInput!) {
        createImage(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

@Injectable({
    providedIn: 'root',
})
export class ImageService extends AbstractModelService<any,
    any,
    any,
    any,
    CreateImageMutation['createImage'],
    CreateImageMutationVariables,
    any,
    any,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'image',
            null,
            null,
            createImageMutation,
            null,
            null);
    }

    public getEmptyObject(): ImageInput {
        return {
            file: '',
        };
    }

}

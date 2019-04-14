import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';
import { CreateImage, CreateImageVariables, ImageInput } from '../../../shared/generated-types';
import { AbstractModelService } from '../../../natural/services/abstract-model.service';

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
    CreateImage['createImage'],
    CreateImageVariables,
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

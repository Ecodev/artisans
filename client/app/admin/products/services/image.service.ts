import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CreateImage, CreateImageVariables, ImageInput } from '../../../shared/generated-types';
import { userMetaFragment } from '../../../shared/queries/fragments';

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
export class ImageService extends NaturalAbstractModelService<any,
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

    protected getDefaultForServer(): ImageInput {
        return {
            file: '',
        };
    }

}

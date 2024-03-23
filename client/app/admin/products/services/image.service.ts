import {gql} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {CreateImage, CreateImageVariables, ImageInput} from '../../../shared/generated-types';
import {userMetaFragment} from '../../../shared/queries/fragments';

export const createImageMutation = gql`
    mutation CreateImage($input: ImageInput!) {
        createImage(input: $input) {
            id
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

@Injectable({
    providedIn: 'root',
})
export class ImageService extends NaturalAbstractModelService<
    never,
    never,
    never,
    never,
    CreateImage['createImage'],
    CreateImageVariables,
    never,
    never,
    never,
    never
> {
    public constructor() {
        super('image', null, null, createImageMutation, null, null);
    }

    public override getDefaultForServer(): ImageInput {
        return {
            file: null as unknown as File,
        };
    }
}

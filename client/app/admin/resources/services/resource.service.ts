import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { createResourceMutation, resourceQuery, resourcesQuery, updateResourceMutation } from './resource.queries';
import {
    CreateResourceMutation,
    CreateResourceMutationVariables,
    ResourceInput,
    ResourceQuery,
    ResourceQueryVariables,
    ResourcesQuery,
    ResourcesQueryVariables,
    UpdateResourceMutation,
    UpdateResourceMutationVariables,
} from '../../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class ResourceService extends AbstractModelService<ResourceQuery['resource'],
    ResourceQueryVariables,
    ResourcesQuery['resources'],
    ResourcesQueryVariables,
    CreateResourceMutation['createResource'],
    CreateResourceMutationVariables,
    UpdateResourceMutation['updateResource'],
    UpdateResourceMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'resource',
            resourceQuery,
            resourcesQuery,
            createResourceMutation,
            updateResourceMutation,
            null);
    }

    public getEmptyObject(): ResourceInput {
        return {
            name: '',
            description: '',
        };
    }

}

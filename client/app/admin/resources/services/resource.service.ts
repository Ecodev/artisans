import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { createResourceMutation, resourceQuery, resourcesQuery, updateResourceMutation } from './resource.queries';
import {
    CreateItemMutation,
    CreateItemMutationVariables,
    ItemInput,
    ItemQuery,
    ItemQueryVariables,
    ItemsQuery,
    ItemsQueryVariables,
    UpdateItemMutation,
    UpdateItemMutationVariables,
} from '../../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class ResourceService extends AbstractModelService<ItemQuery['item'],
    ItemQueryVariables,
    ItemsQuery['items'],
    ItemsQueryVariables,
    CreateItemMutation['createItem'],
    CreateItemMutationVariables,
    UpdateItemMutation['updateItem'],
    UpdateItemMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'item',
            resourceQuery,
            resourcesQuery,
            createResourceMutation,
            updateResourceMutation,
            null);
    }

    public getEmptyObject(): ItemInput {
        return {
            name: '',
            description: '',
        };
    }

}

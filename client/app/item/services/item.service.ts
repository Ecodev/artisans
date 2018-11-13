import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { pick } from 'lodash';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { createItemMutation, itemQuery, itemsQuery, updateItemMutation } from './item.queries';
import {
    CreateItemMutation,
    CreateItemMutationVariables, ItemInput,
    ItemPartialInput,
    ItemQuery,
    ItemQueryVariables,
    ItemsQuery,
    ItemsQueryVariables,
    UpdateItemMutation,
    UpdateItemMutationVariables,
} from '../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class ItemService extends AbstractModelService<ItemQuery['item'],
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
            itemQuery,
            itemsQuery,
            createItemMutation,
            updateItemMutation,
            null);
    }

    public getEmptyObject(): ItemInput {
        return {
            name: '',
            description: '',
        };
    }

}

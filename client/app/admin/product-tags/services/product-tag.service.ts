import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import {
    FormAsyncValidators,
    FormValidators,
    NaturalAbstractModelService,
    NaturalQueryVariablesManager,
    NaturalValidators,
} from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
    CreateProductTag,
    CreateProductTagVariables,
    ProductTag,
    ProductTagInput,
    ProductTags,
    ProductTagsVariables,
    ProductTagVariables,
    UpdateProductTag,
    UpdateProductTagVariables,
} from '../../../shared/generated-types';
import { createProductTag, deleteProductTags, productTagQuery, productTagsQuery, updateProductTag } from './product-tag.queries';

@Injectable({
    providedIn: 'root',
})
export class ProductTagService extends NaturalAbstractModelService<ProductTag['productTag'],
    ProductTagVariables,
    ProductTags['productTags'],
    ProductTagsVariables,
    CreateProductTag['createProductTag'],
    CreateProductTagVariables,
    UpdateProductTag['updateProductTag'],
    UpdateProductTagVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'productTag',
            productTagQuery,
            productTagsQuery,
            createProductTag,
            updateProductTag,
            deleteProductTags);
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

    public getFormAsyncValidators(): FormAsyncValidators {
        return {
            name: [NaturalValidators.unique('name', this)],
        };
    }

    public resolveByName(name: string) {
        const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
        qvm.set('variables', {filter: {groups: [{conditions: [{name: {equal: {value: name}}}]}]}});
        return this.getAll(qvm).pipe(map(res => ({model: res.items[0]})));
    }

    protected getDefaultForServer(): ProductTagInput {
        return {
            name: '',
            color: '',
        };
    }

}
